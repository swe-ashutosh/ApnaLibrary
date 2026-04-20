import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';

// Define the environment types so TypeScript knows about our DB
type Bindings = {
  DB: D1Database;
  ALLOWED_ORIGIN: string; // Set in wrangler.jsonc or dashboard
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Dynamic CORS — reads from environment variable, fallback to localhost for dev
app.use('/*', cors({
  origin: (origin, c) => {
    const allowed = c.env.ALLOWED_ORIGIN || 'http://localhost:3000';
    // Support comma-separated origins for multiple allowed domains
    const origins = allowed.split(',').map((o: string) => o.trim());
    if (origins.includes(origin)) {
      return origin;
    }
    // In dev, allow localhost
    if (origin?.startsWith('http://localhost')) {
      return origin;
    }
    // Permissive fallback to allow deployed frontend
    if (origin) {
      return origin;
    }
    return origins[0];
  },
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (c) => c.text('Apna Library API is Online 🚀'));

// ================================
// AUTH & SIGNUP ROUTES
// ================================

// SIGNUP ROUTE
app.post('/api/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { id, full_name, mobile_number, parent_mobile, course } = body;

    // Validate required fields
    if (!id || !full_name || !mobile_number || !course) {
      return c.json({
        success: false,
        error: 'Missing required fields: id, full_name, mobile_number, course'
      }, 400);
    }

    // Insert data into D1 Database
    const result = await c.env.DB.prepare(
      `INSERT INTO students (id, full_name, mobile_number, parent_mobile, course) VALUES (?, ?, ?, ?, ?)`
    )
    .bind(id, full_name, mobile_number, parent_mobile || null, course)
    .run();

    return c.json({ success: true, message: 'Student registered successfully', data: result });
  } catch (error: any) {
    console.error('Signup error:', error);
    // Handle duplicate entries gracefully
    if (error.message?.includes('UNIQUE constraint failed')) {
      return c.json({
        success: false,
        error: 'A student with this mobile number or ID already exists.'
      }, 409);
    }
    return c.json({
      success: false,
      error: error.message || 'Unknown error',
    }, 500);
  }
});

// CHECK USER STATUS (for login flow)
app.get('/api/user-status/:id', async (c) => {
  const userId = c.req.param('id');

  try {
    const result = await c.env.DB.prepare(
      "SELECT status FROM students WHERE id = ?"
    )
    .bind(userId)
    .first();

    if (!result) {
      return c.json({ status: 'not_found' }, 404);
    }

    return c.json({ status: result.status });
  } catch (error: any) {
    console.error('User status error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ================================
// ADMIN ROUTES
// ================================

// Update Student Status (approve, block, unblock)
app.post('/api/admin/update-status', async (c) => {
  try {
    const { id, status } = await c.req.json();

    if (!id || !status) {
      return c.json({ success: false, error: 'Missing id or status' }, 400);
    }

    const validStatuses = ['pending', 'approved', 'blocked'];
    if (!validStatuses.includes(status)) {
      return c.json({ success: false, error: 'Invalid status value' }, 400);
    }

    await c.env.DB.prepare("UPDATE students SET status = ? WHERE id = ?")
      .bind(status, id)
      .run();

    return c.json({ success: true, message: `Student status updated to ${status}` });
  } catch (error: any) {
    console.error('Update status error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Student List & Fees
app.get('/api/admin/students', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT id, full_name, mobile_number, parent_mobile, profile_picture, course, status, total_fees, paid_fees, (total_fees - paid_fees) as pending_fees, created_at FROM students ORDER BY created_at DESC"
    ).all();
    return c.json(results);
  } catch (error: any) {
    console.error('Students list error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete Student
app.delete('/api/admin/delete-student/:id', async (c) => {
  try {
    const studentId = c.req.param('id');
    
    // Delete attendance records first (foreign key)
    await c.env.DB.prepare("DELETE FROM attendance WHERE student_id = ?").bind(studentId).run();
    // Delete student
    await c.env.DB.prepare("DELETE FROM students WHERE id = ?").bind(studentId).run();
    
    return c.json({ success: true, message: 'Student deleted successfully' });
  } catch (error: any) {
    console.error('Delete student error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update Fees
app.post('/api/admin/update-fees', async (c) => {
  try {
    const { id, total_fees, paid_fees } = await c.req.json();

    if (!id) {
      return c.json({ success: false, error: 'Missing student id' }, 400);
    }

    await c.env.DB.prepare(
      "UPDATE students SET total_fees = ?, paid_fees = ? WHERE id = ?"
    ).bind(total_fees || 0, paid_fees || 0, id).run();

    return c.json({ success: true, message: 'Fees updated successfully' });
  } catch (error: any) {
    console.error('Update fees error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Attendance — Mark attendance manually
app.post('/api/admin/mark-attendance', async (c) => {
  try {
    const { student_id } = await c.req.json();

    if (!student_id) {
      return c.json({ success: false, error: 'Missing student_id' }, 400);
    }

    // Check if already marked today
    const existing = await c.env.DB.prepare(
      "SELECT id FROM attendance WHERE student_id = ? AND date = DATE('now')"
    ).bind(student_id).first();

    if (existing) {
      return c.json({ success: false, error: 'Attendance already marked today' }, 409);
    }

    await c.env.DB.prepare(
      "INSERT INTO attendance (student_id) VALUES (?)"
    ).bind(student_id).run();

    return c.json({ success: true, message: 'Attendance marked' });
  } catch (error: any) {
    console.error('Mark attendance error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Scan QR to Mark Attendance
app.post('/api/admin/scan-qr', async (c) => {
  try {
    const { token } = await c.req.json();

    if (!token) {
      return c.json({ success: false, error: 'Token is required' }, 400);
    }

    // Verify JWT
    const secret = c.env.JWT_SECRET || 'local_dev_secret_123';
    let payload;
    try {
      payload = await verify(token, secret, "HS256");
    } catch (err) {
      return c.json({ success: false, error: 'Invalid or expired QR code' }, 401);
    }

    const student_id = payload.student_id;
    if (!student_id) {
      return c.json({ success: false, error: 'Invalid QR data' }, 400);
    }

    // Check if already marked today
    const existing = await c.env.DB.prepare(
      "SELECT id FROM attendance WHERE student_id = ? AND date = DATE('now')"
    ).bind(student_id).first();

    if (existing) {
      return c.json({ success: false, error: 'Attendance already marked today' }, 409);
    }

    // Mark attendance
    await c.env.DB.prepare(
      "INSERT INTO attendance (student_id) VALUES (?)"
    ).bind(student_id).run();

    // Fetch parent mobile & name for SMS simulation
    const student = await c.env.DB.prepare(
      "SELECT full_name, parent_mobile FROM students WHERE id = ?"
    ).bind(student_id).first();

    if (student) {
      console.log(`[SMS Simulation] To: ${student.parent_mobile || 'N/A'}, Message: Your child ${student.full_name} has arrived at the library.`);
    }

    return c.json({ 
      success: true, 
      message: 'Attendance marked & parent notified successfully',
      studentName: student?.full_name 
    });
  } catch (error: any) {
    console.error('QR scan error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Attendance Stats
app.get('/api/admin/attendance-stats', async (c) => {
  try {
    const todayCount = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM attendance WHERE date = DATE('now')"
    ).first();

    const history = await c.env.DB.prepare(
      "SELECT student_id, COUNT(*) as days_present FROM attendance GROUP BY student_id"
    ).all();

    // Get today's present students
    const todayPresent = await c.env.DB.prepare(
      "SELECT a.student_id, s.full_name FROM attendance a JOIN students s ON a.student_id = s.id WHERE a.date = DATE('now')"
    ).all();

    return c.json({
      today: todayCount?.count || 0,
      history: history.results || [],
      todayPresent: todayPresent.results || [],
    });
  } catch (error: any) {
    console.error('Attendance stats error:', error);
    return c.json({ today: 0, history: [], todayPresent: [] }, 500);
  }
});

// ================================
// BLOG ROUTES
// ================================

// Post Blog
app.post('/api/admin/blogs', async (c) => {
  try {
    const { title, content } = await c.req.json();

    if (!title || !content) {
      return c.json({ success: false, error: 'Title and content are required' }, 400);
    }

    await c.env.DB.prepare(
      "INSERT INTO blogs (title, content) VALUES (?, ?)"
    ).bind(title, content).run();

    return c.json({ success: true, message: 'Blog posted successfully' });
  } catch (error: any) {
    console.error('Blog post error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get All Blogs (public)
app.get('/api/blogs', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT id, title, content, author, created_at FROM blogs ORDER BY created_at DESC"
    ).all();
    return c.json(results || []);
  } catch (error: any) {
    console.error('Blogs fetch error:', error);
    return c.json([], 500);
  }
});

// Delete Blog
app.delete('/api/admin/blogs/:id', async (c) => {
  try {
    const blogId = c.req.param('id');
    await c.env.DB.prepare("DELETE FROM blogs WHERE id = ?").bind(blogId).run();
    return c.json({ success: true, message: 'Blog deleted' });
  } catch (error: any) {
    console.error('Blog delete error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete Student
app.delete('/api/admin/students/:id', async (c) => {
  try {
    const studentId = c.req.param('id');
    // Delete attendance records first
    await c.env.DB.prepare("DELETE FROM attendance WHERE student_id = ?").bind(studentId).run();
    await c.env.DB.prepare("DELETE FROM students WHERE id = ?").bind(studentId).run();
    return c.json({ success: true, message: 'Student deleted' });
  } catch (error: any) {
    console.error('Student delete error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get single student profile (for student dashboard)
app.get('/api/student/:id', async (c) => {
  try {
    const studentId = c.req.param('id');
    const student = await c.env.DB.prepare(
      "SELECT id, full_name, mobile_number, parent_mobile, profile_picture, course, status, total_fees, paid_fees, (total_fees - paid_fees) as pending_fees, created_at FROM students WHERE id = ?"
    ).bind(studentId).first();

    if (!student) {
      return c.json({ error: 'Student not found' }, 404);
    }

    // Get attendance count
    const attendance = await c.env.DB.prepare(
      "SELECT COUNT(*) as days_present FROM attendance WHERE student_id = ?"
    ).bind(studentId).first();

    return c.json({
      ...student,
      days_present: attendance?.days_present || 0,
    });
  } catch (error: any) {
    console.error('Student profile error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Generate dynamic QR token for student
app.get('/api/student/qr-token/:id', async (c) => {
  try {
    const studentId = c.req.param('id');

    // Verify student exists
    const student = await c.env.DB.prepare(
      "SELECT id FROM students WHERE id = ? AND status = 'approved'"
    ).bind(studentId).first();

    if (!student) {
      return c.json({ success: false, error: 'Student not found or not approved' }, 404);
    }

    const secret = c.env.JWT_SECRET || 'local_dev_secret_123';
    // Expire in 60 seconds
    const exp = Math.floor(Date.now() / 1000) + 60;
    
    const token = await sign({ student_id: studentId, exp }, secret, "HS256");

    return c.json({ success: true, token });
  } catch (error: any) {
    console.error('QR token error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update Profile Picture
app.post('/api/student/update-profile-picture', async (c) => {
  try {
    const { id, profile_picture } = await c.req.json();

    if (!id || !profile_picture) {
      return c.json({ success: false, error: 'Missing student id or image url' }, 400);
    }

    await c.env.DB.prepare(
      "UPDATE students SET profile_picture = ? WHERE id = ?"
    ).bind(profile_picture, id).run();

    return c.json({ success: true, message: 'Profile picture updated successfully' });
  } catch (error: any) {
    console.error('Profile picture update error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;

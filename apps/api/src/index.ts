import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Define the environment types so TypeScript knows about our DB
type Bindings = {
  DB: D1Database; // This is the D1 database binding from Cloudflare
};

const app = new Hono<{ Bindings: Bindings }>();

// Allow your Next.js frontend to talk to this API
app.use('/*', cors({
  origin: 'http://localhost:3000', // Your Next.js URL
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}));

app.get('/', (c) => c.text('Apna Library API is Online'));

// SIGNUP ROUTE
app.post('/api/signup', async (c) => {
  const body = await c.req.json();
  const { id, full_name, mobile_number } = body;

  try {
    // Insert data into your D1 Database
    await c.env.DB.prepare(
      `INSERT INTO students (id, full_name, mobile_number) VALUES (?, ?, ?)`
    )
    .bind(id, full_name, mobile_number)
    .run();

    return c.json({ success: true, message: 'Student registered in D1' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }

});


// Add this to apps/api/src/index.ts for check user login 

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
    return c.json({ error: error.message }, 500);
  }
});


// 1 & 2. Approval, Block/Unblock
app.post('/api/admin/update-status', async (c) => {
  const { id, status } = await c.req.json(); // status: 'approved', 'blocked', 'pending'
  await c.env.DB.prepare("UPDATE students SET status = ? WHERE id = ?").bind(status, id).run();
  return c.json({ success: true });
});

// 3. Student List & Fees
app.get('/api/admin/students', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, full_name, mobile_number, status, total_fees, paid_fees, (total_fees - paid_fees) as pending_fees FROM students"
  ).all();
  return c.json(results);
});

// 4. Attendance Stats
app.get('/api/admin/attendance-stats', async (c) => {
  const today = new Array().fill(0); // Logic for today's count
  const todayCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM attendance WHERE date = DATE('now')").first();
  const history = await c.env.DB.prepare(
    "SELECT student_id, COUNT(*) as days_present FROM attendance GROUP BY student_id"
  ).all();
  return c.json({ today: todayCount?.count, history: history.results });
});

// 5. Blog Posting
app.post('/api/admin/blogs', async (c) => {
  const { title, content } = await c.req.json();
  await c.env.DB.prepare("INSERT INTO blogs (title, content) VALUES (?, ?)").bind(title, content).run();
  return c.json({ success: true });
});



export default app;


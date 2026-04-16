CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,       -- This will be the UID from Supabase
  full_name TEXT NOT NULL,
  mobile_number TEXT UNIQUE,
  seat_assigned INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Update Students Table
ALTER TABLE students ADD COLUMN status TEXT DEFAULT 'pending'; -- pending, approved, blocked
ALTER TABLE students ADD COLUMN total_fees INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN paid_fees INTEGER DEFAULT 0;

-- 2. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id TEXT NOT NULL,
  date TEXT DEFAULT (DATE('now')),
  status TEXT DEFAULT 'present',
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 3. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
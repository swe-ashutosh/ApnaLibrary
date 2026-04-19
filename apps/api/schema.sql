-- ============================================
-- Apna Library - Database Schema
-- Safe to run multiple times (idempotent)
-- ============================================

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile_number TEXT UNIQUE,
  parent_mobile TEXT,
  profile_picture TEXT,
  course TEXT,
  status TEXT DEFAULT 'pending',
  total_fees INTEGER DEFAULT 0,
  paid_fees INTEGER DEFAULT 0,
  seat_assigned INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
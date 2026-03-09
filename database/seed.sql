USE faculty_workload_db;

INSERT INTO departments (name, hod_name) VALUES
('Computer Science', 'Dr. Ramesh Kumar'),
('Electronics & Communication', 'Dr. Priya Nair'),
('Mechanical Engineering', 'Dr. Suresh Menon');

INSERT INTO users (name, email, password, role, designation, employee_id) VALUES
('Admin HOD', 'admin@harvard.com', '$2b$10$f8PdjcGS6dXer85cc8Ji6.vWW.wkHORuUv1QFHA2ilp1E.b.Fyn5q', 'ADMIN', 'HOD', 'ADM001');

INSERT INTO users (name, email, password, role, department_id, designation, max_hours, employee_id) VALUES
('Dr. Anitha Krishnan',  'anitha@harvard.com',  '$2b$10$Ye.2dhrtN3WFFPgWZbHRyeifaFzw5pGZyix4exjTVLuLfV8MoOPjy', 'FACULTY', 1, 'Associate Professor', 18, 'FAC001'),
('Prof. Vijay Shankar',  'vijay@harvard.com',   '$2b$10$Ye.2dhrtN3WFFPgWZbHRyeifaFzw5pGZyix4exjTVLuLfV8MoOPjy', 'FACULTY', 1, 'Assistant Professor', 16, 'FAC002'),
('Dr. Meena Lakshmi',    'meena@harvard.com',   '$2b$10$Ye.2dhrtN3WFFPgWZbHRyeifaFzw5pGZyix4exjTVLuLfV8MoOPjy', 'FACULTY', 2, 'Professor',           20, 'FAC003'),
('Prof. Ravi Chandran',  'ravi@harvard.com',    '$2b$10$Ye.2dhrtN3WFFPgWZbHRyeifaFzw5pGZyix4exjTVLuLfV8MoOPjy', 'FACULTY', 2, 'Assistant Professor', 16, 'FAC004'),
('Dr. Kavitha Sundaram', 'kavitha@harvard.com', '$2b$10$Ye.2dhrtN3WFFPgWZbHRyeifaFzw5pGZyix4exjTVLuLfV8MoOPjy', 'FACULTY', 3, 'Associate Professor', 18, 'FAC005');

INSERT INTO subjects (name, code, semester, department_id, credits, hours_per_week) VALUES
('Data Structures',     'CS301', 3, 1, 4, 5),
('Database Management', 'CS401', 4, 1, 3, 4),
('Operating Systems',   'CS501', 5, 1, 4, 5),
('Machine Learning',    'CS601', 6, 1, 3, 4),
('Digital Circuits',    'EC301', 3, 2, 4, 5),
('Signal Processing',   'EC401', 4, 2, 3, 4),
('Thermodynamics',      'ME301', 3, 3, 4, 5),
('Fluid Mechanics',     'ME401', 4, 3, 3, 4);

INSERT INTO allocations (faculty_id, subject_id, hours_per_week, duty_type, semester, academic_year) VALUES
(2, 1, 5, 'TEACHING', 3, '2024-25'),
(2, 2, 4, 'TEACHING', 4, '2024-25'),
(3, 3, 5, 'TEACHING', 5, '2024-25'),
(3, 4, 4, 'LAB',      6, '2024-25'),
(4, 5, 5, 'TEACHING', 3, '2024-25'),
(5, 6, 4, 'TEACHING', 4, '2024-25'),
(6, 7, 5, 'TEACHING', 3, '2024-25'),
(6, 8, 4, 'LAB',      4, '2024-25');

INSERT INTO leaves (faculty_id, leave_type, from_date, to_date, reason, status) VALUES
(2, 'CASUAL',  '2025-03-10', '2025-03-11', 'Personal work',        'APPROVED'),
(3, 'MEDICAL', '2025-03-15', '2025-03-17', 'Medical consultation', 'PENDING');

INSERT INTO requests (faculty_id, type, subject_id, reason, status) VALUES
(2, 'WORKLOAD_REDUCTION', 1, 'Currently handling extra lab sessions', 'PENDING'),
(4, 'SUBJECT_SWAP',       5, 'Prefer to teach Signal Processing',      'PENDING');

INSERT INTO notifications (title, message, target_type, priority, created_by) VALUES
('Welcome to New Semester', 'The academic year 2024-25 has commenced.', 'ALL', 'NORMAL', 1),
('Timetable Submission', 'All faculty must confirm timetable by end of week.', 'ALL', 'URGENT', 1);


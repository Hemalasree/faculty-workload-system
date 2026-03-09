# 🎓 Faculty Workload Management System

A full-stack web application for managing faculty workloads in a college. Built with React, Node.js/Express, and MySQL.

---

## 🛠 Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend  | Node.js, Express.js |
| Database | MySQL (via mysql2) |
| Auth     | JWT + bcryptjs |
| Icons    | Lucide React |

---

## 📁 Folder Structure

```
faculty-workload-system/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/auth.js
│   │   └── routes/
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/api.js
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
└── database/
    ├── schema.sql
    └── seed.sql
```

---

## ⚙️ Setup Instructions

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run schema
source /path/to/database/schema.sql

# Run seed data
source /path/to/database/seed.sql
```

> **IMPORTANT:** The seed file uses a placeholder password hash. Before running, generate correct bcrypt hashes:

```bash
node -e "const b=require('bcryptjs'); b.hash('your_password',10).then(h=>console.log(h))"
```

Replace the `$2b$10$...` values in `seed.sql` with your generated hashes.

**Demo credentials (after seeding):**
- Admin: `admin@college.edu` / (your chosen password)
- Faculty: `anitha@college.edu` / (your chosen password)

---

### 2. Backend Setup

```bash
cd backend
npm install

# Configure .env (already created):
# PORT=5000
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=3185      ← change to your MySQL password
# DB_NAME=faculty_workload_db
# JWT_SECRET=faculty_workload_super_secret_2024

npm run dev
# Server runs at http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

---

## 🔐 Authentication

- JWT stored in `localStorage`
- Auto-redirects to `/login` on 401
- Role-based routing: Admin → `/admin`, Faculty → `/faculty`
- All API routes protected by JWT middleware

---

## 🌟 Features

### Admin
- Dashboard with charts (workload bar, status pie, dept chart)
- Faculty CRUD (add, edit, delete)
- Subject CRUD with department/semester filters
- Department management
- Subject allocation with overload prevention
- Workload management with color-coded status
- Request & Leave approval/rejection
- Notifications/announcements system
- CSV report generation with filters

### Faculty
- Personal dashboard with workload donut chart
- View assigned subjects
- Workload breakdown by duty type
- Leave management (apply, track)
- Workload requests (submit, track)
- Notifications with mark-as-read
- Own CSV report download
- Profile management

---

## 🎨 UI

- **Light/Dark mode** toggle (persisted in localStorage)
- **Pastel color palette**: soft blues, lavenders, mint greens, peach
- Clean sidebar navigation per role
- Responsive cards, tables, charts
- Toast notifications for all actions

---

## 🗃️ API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register-faculty | Add faculty (admin) |
| GET  | /api/auth/me | Get current user |
| PUT  | /api/auth/profile | Update profile |
| GET  | /api/faculty | List all faculty |
| GET  | /api/subjects | List all subjects |
| GET/POST | /api/departments | Departments CRUD |
| GET/POST | /api/allocations | Allocations |
| GET  | /api/allocations/my | Faculty's own allocations |
| GET  | /api/allocations/summary | Workload summary (admin) |
| GET  | /api/allocations/report | Report data |
| POST | /api/leaves | Apply for leave |
| GET  | /api/leaves/my | Own leaves |
| GET  | /api/leaves/all | All leaves (admin) |
| POST | /api/requests | Submit request |
| GET  | /api/dashboard/admin | Admin dashboard data |
| GET  | /api/dashboard/faculty | Faculty dashboard data |
| GET  | /api/notifications | Get notifications |
| POST | /api/notifications | Send notification (admin) |

---

## ⚠️ Common Issues

1. **CORS error**: Ensure backend is running on port 5000 before starting frontend
2. **DB connection**: Check your `.env` DB credentials match your MySQL setup
3. **Invalid token**: Clear localStorage and re-login
4. **Overload warning**: Admin receives a 400 error if allocation would exceed faculty max hours
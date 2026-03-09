const pool = require("../config/db");

// Get workload status for a faculty
const getWorkloadStatus = (assigned, max) => {
  const pct = (assigned / max) * 100;
  if (pct >= 100) return "OVERLOADED";
  if (pct >= 80)  return "NEAR_LIMIT";
  return "NORMAL";
};

// GET all allocations (admin view)
exports.getAllAllocations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, u.name as faculty_name, u.max_hours,
              s.name as subject_name, s.code as subject_code
       FROM allocations a
       JOIN users u ON a.faculty_id = u.id
       JOIN subjects s ON a.subject_id = s.id
       ORDER BY u.name, a.semester`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET allocations for logged-in faculty
exports.getMyAllocations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, s.name as subject_name, s.code as subject_code,
              s.credits, d.name as department_name
       FROM allocations a
       JOIN subjects s ON a.subject_id = s.id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE a.faculty_id = ?
       ORDER BY a.semester`,
      [req.user.id]
    );

    const [user] = await pool.query("SELECT max_hours FROM users WHERE id=?", [req.user.id]);
    const totalHours = rows.reduce((sum, r) => sum + r.hours_per_week, 0);
    const maxHours = user[0]?.max_hours || 18;

    res.json({
      success: true,
      data: rows,
      summary: {
        totalHours,
        maxHours,
        status: getWorkloadStatus(totalHours, maxHours)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET workload summary per faculty (for admin workload management)
exports.getWorkloadSummary = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.max_hours, d.name as department,
              COALESCE(SUM(a.hours_per_week),0) as total_hours,
              COUNT(a.id) as subject_count
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN allocations a ON u.id = a.faculty_id
       WHERE u.role = 'FACULTY'
       GROUP BY u.id
       ORDER BY total_hours DESC`
    );

    const data = rows.map(r => ({
      ...r,
      status: getWorkloadStatus(r.total_hours, r.max_hours)
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST allocate subject to faculty
exports.allocate = async (req, res) => {
  try {
    const { faculty_id, subject_id, hours_per_week, duty_type, semester, academic_year } = req.body;
    if (!faculty_id || !subject_id || !hours_per_week || !semester)
      return res.status(400).json({ success: false, message: "Faculty, subject, hours, and semester are required" });

    // Check current workload
    const [[faculty]] = await pool.query("SELECT max_hours FROM users WHERE id=?", [faculty_id]);
    const [[current]] = await pool.query(
      "SELECT COALESCE(SUM(hours_per_week),0) as total FROM allocations WHERE faculty_id=?",
      [faculty_id]
    );

    const newTotal = Number(current.total) + Number(hours_per_week);
    if (newTotal > faculty.max_hours)
      return res.status(400).json({
        success: false,
        message: `Overload! Faculty max is ${faculty.max_hours}h, current is ${current.total}h, adding ${hours_per_week}h would exceed limit.`,
        overload: true
      });

    const [result] = await pool.query(
      "INSERT INTO allocations (faculty_id, subject_id, hours_per_week, duty_type, semester, academic_year) VALUES (?,?,?,?,?,?)",
      [faculty_id, subject_id, hours_per_week, duty_type || "TEACHING", semester, academic_year || "2024-25"]
    );

    res.json({
      success: true,
      message: "Workload allocated successfully",
      id: result.insertId,
      summary: { newTotal, maxHours: faculty.max_hours, status: getWorkloadStatus(newTotal, faculty.max_hours) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE allocation
exports.deleteAllocation = async (req, res) => {
  try {
    await pool.query("DELETE FROM allocations WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Allocation removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET report data (CSV-ready)
exports.getReport = async (req, res) => {
  try {
    const { department_id, faculty_id, semester, academic_year } = req.query;
    let q = `SELECT u.name as faculty_name, u.employee_id, d.name as department,
                    s.name as subject_name, s.code as subject_code,
                    a.hours_per_week, a.duty_type, a.semester, a.academic_year,
                    u.max_hours,
                    (SELECT COALESCE(SUM(a2.hours_per_week),0) FROM allocations a2 WHERE a2.faculty_id=u.id) as total_hours
             FROM allocations a
             JOIN users u ON a.faculty_id = u.id
             JOIN subjects s ON a.subject_id = s.id
             LEFT JOIN departments d ON u.department_id = d.id
             WHERE 1=1`;
    const params = [];
    if (department_id)  { q += " AND u.department_id=?"; params.push(department_id); }
    if (faculty_id)     { q += " AND a.faculty_id=?";    params.push(faculty_id); }
    if (semester)       { q += " AND a.semester=?";      params.push(semester); }
    if (academic_year)  { q += " AND a.academic_year=?"; params.push(academic_year); }
    q += " ORDER BY u.name, a.semester";

    const [rows] = await pool.query(q, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
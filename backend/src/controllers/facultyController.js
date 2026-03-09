const pool = require("../config/db");

exports.getAllFaculty = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.designation, u.max_hours, u.phone, u.employee_id,
              d.name as department, d.id as department_id,
              COALESCE(SUM(a.hours_per_week),0) as assigned_hours
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN allocations a ON u.id = a.faculty_id
       WHERE u.role = 'FACULTY'
       GROUP BY u.id
       ORDER BY u.name`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFacultyById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.designation, u.max_hours, u.phone, u.employee_id,
              d.name as department, d.id as department_id
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = ? AND u.role = 'FACULTY'`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Faculty not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const { name, email, designation, max_hours, department_id, phone } = req.body;
    await pool.query(
      `UPDATE users SET name=?, email=?, designation=?, max_hours=?, department_id=?, phone=?
       WHERE id=? AND role='FACULTY'`,
      [name, email, designation, max_hours, department_id, phone, req.params.id]
    );
    res.json({ success: true, message: "Faculty updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id=? AND role='FACULTY'", [req.params.id]);
    res.json({ success: true, message: "Faculty removed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
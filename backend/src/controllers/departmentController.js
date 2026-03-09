const pool = require("../config/db");

exports.getAllDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.*, COUNT(u.id) as faculty_count
       FROM departments d
       LEFT JOIN users u ON u.department_id = d.id AND u.role='FACULTY'
       GROUP BY d.id ORDER BY d.name`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, hod_name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Department name required" });
    const [result] = await pool.query(
      "INSERT INTO departments (name, hod_name) VALUES (?,?)",
      [name, hod_name || ""]
    );
    res.json({ success: true, message: "Department created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { name, hod_name } = req.body;
    await pool.query("UPDATE departments SET name=?, hod_name=? WHERE id=?", [name, hod_name, req.params.id]);
    res.json({ success: true, message: "Department updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    await pool.query("DELETE FROM departments WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
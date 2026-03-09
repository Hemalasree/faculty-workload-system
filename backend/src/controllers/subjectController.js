const pool = require("../config/db");

exports.getAllSubjects = async (req, res) => {
  try {
    const { department_id, semester } = req.query;
    let q = `SELECT s.*, d.name as department_name
             FROM subjects s
             LEFT JOIN departments d ON s.department_id = d.id
             WHERE 1=1`;
    const params = [];
    if (department_id) { q += " AND s.department_id=?"; params.push(department_id); }
    if (semester)      { q += " AND s.semester=?";      params.push(semester); }
    q += " ORDER BY s.semester, s.name";
    const [rows] = await pool.query(q, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { name, code, semester, department_id, credits, hours_per_week } = req.body;
    if (!name || !code || !semester)
      return res.status(400).json({ success: false, message: "Name, code, and semester required" });

    const [existing] = await pool.query("SELECT id FROM subjects WHERE code=?", [code]);
    if (existing.length) return res.status(400).json({ success: false, message: "Subject code already exists" });

    const [result] = await pool.query(
      "INSERT INTO subjects (name, code, semester, department_id, credits, hours_per_week) VALUES (?,?,?,?,?,?)",
      [name, code, semester, department_id || null, credits || 3, hours_per_week || 4]
    );
    res.json({ success: true, message: "Subject added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { name, code, semester, department_id, credits, hours_per_week } = req.body;
    await pool.query(
      "UPDATE subjects SET name=?, code=?, semester=?, department_id=?, credits=?, hours_per_week=? WHERE id=?",
      [name, code, semester, department_id, credits, hours_per_week, req.params.id]
    );
    res.json({ success: true, message: "Subject updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    await pool.query("DELETE FROM subjects WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
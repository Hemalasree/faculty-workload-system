const pool = require("../config/db");

exports.submitRequest = async (req, res) => {
  try {
    const { type, subject_id, reason } = req.body;
    if (!type || !reason)
      return res.status(400).json({ success: false, message: "Type and reason are required" });

    const [result] = await pool.query(
      "INSERT INTO requests (faculty_id, type, subject_id, reason) VALUES (?,?,?,?)",
      [req.user.id, type, subject_id || null, reason]
    );
    res.json({ success: true, message: "Request submitted", id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, s.name as subject_name
       FROM requests r
       LEFT JOIN subjects s ON r.subject_id = s.id
       WHERE r.faculty_id=?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.name as faculty_name, d.name as department, s.name as subject_name
       FROM requests r
       JOIN users u ON r.faculty_id = u.id
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN subjects s ON r.subject_id = s.id
       ORDER BY r.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, admin_remarks } = req.body;
    await pool.query(
      "UPDATE requests SET status=?, admin_remarks=? WHERE id=?",
      [status, admin_remarks || "", req.params.id]
    );
    res.json({ success: true, message: `Request ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
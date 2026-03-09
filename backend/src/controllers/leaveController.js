const pool = require("../config/db");

// Faculty: apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { leave_type, from_date, to_date, reason } = req.body;
    if (!leave_type || !from_date || !to_date)
      return res.status(400).json({ success: false, message: "Leave type, from date, and to date are required" });

    const [result] = await pool.query(
      "INSERT INTO leaves (faculty_id, leave_type, from_date, to_date, reason) VALUES (?,?,?,?,?)",
      [req.user.id, leave_type, from_date, to_date, reason || ""]
    );
    res.json({ success: true, message: "Leave application submitted", id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Faculty: get own leave history
exports.getMyLeaves = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leaves WHERE faculty_id=? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: get all leaves
exports.getAllLeaves = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT l.*, u.name as faculty_name, d.name as department
       FROM leaves l
       JOIN users u ON l.faculty_id = u.id
       LEFT JOIN departments d ON u.department_id = d.id
       ORDER BY l.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: approve or reject leave
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, admin_remarks } = req.body;
    if (!["APPROVED","REJECTED"].includes(status))
      return res.status(400).json({ success: false, message: "Status must be APPROVED or REJECTED" });

    await pool.query(
      "UPDATE leaves SET status=?, admin_remarks=? WHERE id=?",
      [status, admin_remarks || "", req.params.id]
    );
    res.json({ success: true, message: `Leave ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
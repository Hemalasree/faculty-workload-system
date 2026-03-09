const pool = require("../config/db");

exports.createNotification = async (req, res) => {
  try {
    const { title, message, target_type, target_id, priority } = req.body;
    if (!title || !message)
      return res.status(400).json({ success: false, message: "Title and message required" });

    await pool.query(
      "INSERT INTO notifications (title, message, target_type, target_id, priority, created_by) VALUES (?,?,?,?,?,?)",
      [title, message, target_type || "ALL", target_id || null, priority || "NORMAL", req.user.id]
    );
    res.json({ success: true, message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const deptId = req.user.department_id;

    const [rows] = await pool.query(
      `SELECT n.*, 
              (SELECT COUNT(*) FROM notification_reads nr WHERE nr.notification_id=n.id AND nr.faculty_id=?) as is_read
       FROM notifications n
       WHERE n.target_type='ALL'
          OR (n.target_type='FACULTY' AND n.target_id=?)
          OR (n.target_type='DEPARTMENT' AND n.target_id=?)
       ORDER BY n.created_at DESC`,
      [userId, userId, deptId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    await pool.query(
      "INSERT IGNORE INTO notification_reads (notification_id, faculty_id) VALUES (?,?)",
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const deptId = req.user.department_id;
    const [[{ count }]] = await pool.query(
      `SELECT COUNT(*) as count FROM notifications n
       WHERE (n.target_type='ALL' OR (n.target_type='FACULTY' AND n.target_id=?) OR (n.target_type='DEPARTMENT' AND n.target_id=?))
         AND n.id NOT IN (SELECT notification_id FROM notification_reads WHERE faculty_id=?)`,
      [userId, deptId, userId]
    );
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
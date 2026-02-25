const pool = require("../config/db");

exports.allocateWorkload = async (req, res) => {
  try {
    const { faculty_id, subject_id, class_id, hours, duty_type } = req.body;

    const [[faculty]] = await pool.query(
      "SELECT max_hours FROM users WHERE id=? AND role='FACULTY'",
      [faculty_id]
    );

    if (!faculty)
      return res.status(404).json({ message: "Faculty not found" });

    const [[sumRow]] = await pool.query(
      "SELECT COALESCE(SUM(hours),0) as total FROM workload WHERE faculty_id=?",
      [faculty_id]
    );

    const newTotal = sumRow.total + Number(hours);

    if (newTotal > faculty.max_hours) {
      return res.status(400).json({
        message: `Overload detected! Current: ${sumRow.total}, Adding: ${hours}, Limit: ${faculty.max_hours}`
      });
    }

    await pool.query(
      `INSERT INTO workload
       (faculty_id,subject_id,class_id,hours,duty_type)
       VALUES(?,?,?,?,?)`,
      [
        faculty_id,
        subject_id,
        class_id,
        Number(hours),
        duty_type || "TEACHING"
      ]
    );

    res.json({ message: "Workload allocated successfully", newTotal });
  } catch (err) {
    res.status(500).json({ message: "Allocation error", error: err.message });
  }
};

exports.getFacultyWorkload = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const [rows] = await pool.query(
      `SELECT w.id,
              s.subject_name,
              s.subject_code,
              c.class_name,
              w.hours,
              w.duty_type
       FROM workload w
       JOIN subjects s ON w.subject_id = s.id
       JOIN classes c ON w.class_id = c.id
       WHERE w.faculty_id=?`,
      [facultyId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
};

exports.getDepartmentSummary = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.name,
              u.department,
              COALESCE(SUM(w.hours),0) as total_hours,
              u.max_hours
       FROM users u
       LEFT JOIN workload w ON u.id = w.faculty_id
       WHERE u.role='FACULTY'
       GROUP BY u.id
       ORDER BY total_hours DESC`
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Summary error", error: err.message });
  }
};
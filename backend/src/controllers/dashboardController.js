const pool = require("../config/db");

exports.getAdminDashboard = async (req, res) => {
  try {
    const [[{ totalFaculty }]]     = await pool.query("SELECT COUNT(*) as totalFaculty FROM users WHERE role='FACULTY'");
    const [[{ totalSubjects }]]    = await pool.query("SELECT COUNT(*) as totalSubjects FROM subjects");
    const [[{ totalDepartments }]] = await pool.query("SELECT COUNT(*) as totalDepartments FROM departments");
    const [[{ pendingRequests }]]  = await pool.query("SELECT COUNT(*) as pendingRequests FROM requests WHERE status='PENDING'");
    const [[{ pendingLeaves }]]    = await pool.query("SELECT COUNT(*) as pendingLeaves FROM leaves WHERE status='PENDING'");

    // Workload per faculty for bar chart
    const [workloadData] = await pool.query(
      `SELECT u.name, COALESCE(SUM(a.hours_per_week),0) as hours, u.max_hours
       FROM users u
       LEFT JOIN allocations a ON u.id = a.faculty_id
       WHERE u.role='FACULTY'
       GROUP BY u.id ORDER BY hours DESC LIMIT 10`
    );

    // Dept-wise distribution for pie chart
    const [deptData] = await pool.query(
      `SELECT d.name as department, COALESCE(SUM(a.hours_per_week),0) as hours
       FROM departments d
       LEFT JOIN users u ON u.department_id = d.id
       LEFT JOIN allocations a ON a.faculty_id = u.id
       GROUP BY d.id`
    );

    // Overload status histogram
    const [statusData] = await pool.query(
      `SELECT 
         SUM(CASE WHEN pct >= 100 THEN 1 ELSE 0 END) as overloaded,
         SUM(CASE WHEN pct >= 80 AND pct < 100 THEN 1 ELSE 0 END) as near_limit,
         SUM(CASE WHEN pct < 80 THEN 1 ELSE 0 END) as normal
       FROM (
         SELECT (COALESCE(SUM(a.hours_per_week),0) / u.max_hours * 100) as pct
         FROM users u LEFT JOIN allocations a ON u.id = a.faculty_id
         WHERE u.role='FACULTY' GROUP BY u.id
       ) as t`
    );

    res.json({
      success: true,
      data: {
        totalFaculty, totalSubjects, totalDepartments,
        pendingRequests, pendingLeaves,
        workloadChart: workloadData,
        deptChart: deptData,
        statusChart: statusData[0]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFacultyDashboard = async (req, res) => {
  try {
    const id = req.user.id;

    const [allocations] = await pool.query(
      `SELECT a.*, s.name as subject_name, s.code
       FROM allocations a JOIN subjects s ON a.subject_id = s.id
       WHERE a.faculty_id=?`,
      [id]
    );

    const [[user]] = await pool.query("SELECT max_hours FROM users WHERE id=?", [id]);
    const [[{ pendingLeaves }]]   = await pool.query("SELECT COUNT(*) as pendingLeaves FROM leaves WHERE faculty_id=? AND status='PENDING'", [id]);
    const [[{ unreadCount }]] = await pool.query(
      `SELECT COUNT(*) as unreadCount FROM notifications n
       WHERE n.id NOT IN (SELECT notification_id FROM notification_reads WHERE faculty_id=?)`,
      [id]
    );

    const totalHours = allocations.reduce((s, a) => s + a.hours_per_week, 0);
    const breakdown = {
      TEACHING:       allocations.filter(a => a.duty_type === "TEACHING").reduce((s,a) => s+a.hours_per_week, 0),
      LAB:            allocations.filter(a => a.duty_type === "LAB").reduce((s,a) => s+a.hours_per_week, 0),
      NON_TEACHING:   allocations.filter(a => a.duty_type === "NON_TEACHING").reduce((s,a) => s+a.hours_per_week, 0),
      ADMINISTRATIVE: allocations.filter(a => a.duty_type === "ADMINISTRATIVE").reduce((s,a) => s+a.hours_per_week, 0),
      RESEARCH:       allocations.filter(a => a.duty_type === "RESEARCH").reduce((s,a) => s+a.hours_per_week, 0)
    };

    res.json({
      success: true,
      data: {
        totalSubjects: allocations.length,
        totalHours,
        maxHours: user.max_hours,
        pendingLeaves,
        unreadCount,
        breakdown,
        allocations
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
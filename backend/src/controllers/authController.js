const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const [rows] = await pool.query(
      `SELECT u.*, d.name as department_name 
       FROM users u 
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ success: false, message: "User not found" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, department_id: user.department_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        department: user.department_name,
        department_id: user.department_id,
        designation: user.designation,
        employee_id: user.employee_id
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login error", error: err.message });
  }
};

exports.registerFaculty = async (req, res) => {
  try {
    const { name, email, password, department_id, designation, max_hours, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });

    const [existing] = await pool.query("SELECT id FROM users WHERE email=?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const emp_id = "FAC" + Date.now().toString().slice(-5);

    const [result] = await pool.query(
      `INSERT INTO users (name, email, password, role, department_id, designation, max_hours, phone, employee_id)
       VALUES (?, ?, ?, 'FACULTY', ?, ?, ?, ?, ?)`,
      [name, email, hashed, department_id || null, designation || "", max_hours || 18, phone || "", emp_id]
    );

    res.json({ success: true, message: "Faculty registered successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration error", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.designation, u.max_hours, u.phone, u.employee_id,
              d.name as department_name, u.department_id
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const updates = [];
    const values = [];

    if (name)  { updates.push("name=?");  values.push(name); }
    if (phone) { updates.push("phone=?"); values.push(phone); }
    if (email) { updates.push("email=?"); values.push(email); }
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updates.push("password=?");
      values.push(hashed);
    }

    if (updates.length === 0)
      return res.status(400).json({ success: false, message: "Nothing to update" });

    values.push(req.user.id);
    await pool.query(`UPDATE users SET ${updates.join(",")} WHERE id=?`, values);
    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
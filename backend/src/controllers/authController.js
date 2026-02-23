const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerFaculty = async (req, res) => {
  try {
    const { name, email, password, department, designation, max_hours } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users(name,email,password,role,department,designation,max_hours)
       VALUES(?,?,?,?,?,?,?)`,
      [name, email, hashed, "FACULTY", department, designation, max_hours || 16]
    );

    res.json({ message: "Faculty created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering faculty", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      id: user.id
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

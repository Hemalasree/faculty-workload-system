const pool = require("./config/db");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  const hashed = await bcrypt.hash("admin123", 10);

  await pool.query(
    `INSERT INTO users(name,email,password,role)
     VALUES(?,?,?,?)`,
    ["Admin", "admin@gmail.com", hashed, "ADMIN"]
  );

  console.log("Admin created: admin@gmail.com / admin123");
  process.exit();
}

createAdmin();

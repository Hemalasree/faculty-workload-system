const pool = require("./config/db");
const bcrypt = require("bcryptjs");

async function createFaculty() {
  const hashed = await bcrypt.hash("faculty123", 10);

  await pool.query(
    `INSERT INTO users(name,email,password,role,department,designation,max_hours)
     VALUES(?,?,?,?,?,?,?)`,
    ["Faculty1", "faculty1@gmail.com", hashed, "FACULTY", "CSE", "AP", 16]
  );

  console.log("Faculty created: faculty1@gmail.com / faculty123");
  process.exit();
}

createFaculty();

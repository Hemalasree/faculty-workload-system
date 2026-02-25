const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM subjects ORDER BY semester"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
});

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { subject_name, subject_code, semester, department } = req.body;

    await pool.query(
      `INSERT INTO subjects
       (subject_name,subject_code,semester,department)
       VALUES(?,?,?,?)`,
      [subject_name, subject_code, semester, department]
    );

    res.json({ message: "Subject added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Insert error", error: err.message });
  }
});

module.exports = router;
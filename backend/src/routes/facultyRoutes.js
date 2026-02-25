const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id,name,email,department,designation,max_hours
       FROM users
       WHERE role='FACULTY'
       ORDER BY name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Fetch error", error: err.message });
  }
});

module.exports = router;
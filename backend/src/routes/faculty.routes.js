const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

/* ===========================
   GET ALL FACULTY (Admin)
=========================== */
router.get("/", auth, adminOnly, (req, res) => {
  db.query(
    `SELECT faculty.id, users.name, users.email,
            faculty.department, faculty.designation, faculty.max_hours
     FROM faculty
     JOIN users ON faculty.user_id = users.id`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

/* ===========================
   ADD FACULTY (Admin)
=========================== */
router.post("/", auth, adminOnly, async (req, res) => {
  const { name, email, password, department, designation, max_hours } =
    req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'faculty')",
      [name, email, hashed],
      (err, result) => {
        if (err) return res.status(500).json(err);

        const userId = result.insertId;

        db.query(
          "INSERT INTO faculty (user_id, department, designation, max_hours) VALUES (?, ?, ?, ?)",
          [userId, department, designation, max_hours || 18],
          (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ message: "Faculty added successfully" });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
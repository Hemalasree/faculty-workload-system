const express = require("express");
const router = express.Router();

const { auth, adminOnly } = require("../middleware/auth");

const { login, registerFaculty } = require("../controllers/authController");

router.post("/login", login);
router.post("/register-faculty", auth, adminOnly, registerFaculty);

module.exports = router;

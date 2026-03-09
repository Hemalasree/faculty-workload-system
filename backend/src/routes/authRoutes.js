const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { login, registerFaculty, getMe, updateProfile } = require("../controllers/authController");

router.post("/login",              login);
router.post("/register-faculty",   auth, registerFaculty);
router.get("/me",                  auth, getMe);
router.put("/profile",             auth, updateProfile);

module.exports = router;
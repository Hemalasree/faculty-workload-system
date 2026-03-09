const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/dashboardController");

router.get("/admin",   auth, adminOnly, ctrl.getAdminDashboard);
router.get("/faculty", auth, ctrl.getFacultyDashboard);

module.exports = router;
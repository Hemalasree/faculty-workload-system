// leaveRoutes.js
const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/leaveController");

router.post("/",             auth, ctrl.applyLeave);
router.get("/my",            auth, ctrl.getMyLeaves);
router.get("/all",           auth, adminOnly, ctrl.getAllLeaves);
router.put("/:id/status",    auth, adminOnly, ctrl.updateLeaveStatus);

module.exports = router;
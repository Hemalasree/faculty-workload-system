const express = require("express");
const router = express.Router();

const { auth, adminOnly } = require("../middleware/auth");

const {
  allocateWorkload,
  getFacultyWorkload,
  getDepartmentSummary
} = require("../controllers/workloadController");

router.post("/allocate", auth, adminOnly, allocateWorkload);
router.get("/faculty", auth, getFacultyWorkload);
router.get("/summary", auth, adminOnly, getDepartmentSummary);

module.exports = router;

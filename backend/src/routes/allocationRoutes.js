const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/allocationController");

router.get("/",          auth, adminOnly, ctrl.getAllAllocations);
router.get("/summary",   auth, adminOnly, ctrl.getWorkloadSummary);
router.get("/report",    auth, adminOnly, ctrl.getReport);
router.get("/my",        auth, ctrl.getMyAllocations);
router.post("/",         auth, adminOnly, ctrl.allocate);
router.delete("/:id",    auth, adminOnly, ctrl.deleteAllocation);

module.exports = router;
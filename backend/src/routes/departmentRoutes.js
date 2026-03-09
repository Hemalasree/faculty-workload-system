const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/departmentController");

router.get("/",       auth, ctrl.getAllDepartments);
router.post("/",      auth, adminOnly, ctrl.createDepartment);
router.put("/:id",    auth, adminOnly, ctrl.updateDepartment);
router.delete("/:id", auth, adminOnly, ctrl.deleteDepartment);

module.exports = router;
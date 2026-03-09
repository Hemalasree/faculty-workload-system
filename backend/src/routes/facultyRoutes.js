const express = require("express");
const router  = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/facultyController");

router.get("/",       auth, adminOnly, ctrl.getAllFaculty);
router.get("/:id",    auth, adminOnly, ctrl.getFacultyById);
router.put("/:id",    auth, adminOnly, ctrl.updateFaculty);
router.delete("/:id", auth, adminOnly, ctrl.deleteFaculty);

module.exports = router;
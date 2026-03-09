const express = require("express");
const router  = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/subjectController");

router.get("/",       auth, ctrl.getAllSubjects);
router.post("/",      auth, adminOnly, ctrl.createSubject);
router.put("/:id",    auth, adminOnly, ctrl.updateSubject);
router.delete("/:id", auth, adminOnly, ctrl.deleteSubject);

module.exports = router;
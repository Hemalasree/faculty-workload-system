const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/requestController");

router.post("/",           auth, ctrl.submitRequest);
router.get("/my",          auth, ctrl.getMyRequests);
router.get("/all",         auth, adminOnly, ctrl.getAllRequests);
router.put("/:id/status",  auth, adminOnly, ctrl.updateRequestStatus);

module.exports = router;
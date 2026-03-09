const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const ctrl = require("../controllers/notificationController");

router.post("/",          auth, adminOnly, ctrl.createNotification);
router.get("/",           auth, ctrl.getNotifications);
router.get("/unread",     auth, ctrl.getUnreadCount);
router.put("/:id/read",   auth, ctrl.markRead);

module.exports = router;
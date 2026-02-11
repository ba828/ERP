const express = require("express");
const router = express.Router();
const controller = require("../controllers/attendanceController");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.post("/checkin", verifyToken, allowRoles("Employee"), controller.checkIn);
router.post("/checkout", verifyToken, allowRoles("Employee"), controller.checkOut);
router.get("/report", verifyToken, allowRoles("Employee"), controller.monthlyReport);
router.get("/today", verifyToken, allowRoles("Employee"), controller.getTodayAttendance);

module.exports = router;

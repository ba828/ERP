const express = require("express");
const router = express.Router();
const controller = require("../controllers/employeeController");

const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.get("/", verifyToken, allowRoles("Admin", "HR"), controller.getAllEmployees);
router.post("/", verifyToken, allowRoles("Admin", "HR"), controller.createEmployee);
router.put("/:id", verifyToken, allowRoles("Admin", "HR"), controller.updateEmployee);
router.delete("/:id", verifyToken, allowRoles("Admin"), controller.deleteEmployee);

module.exports = router;

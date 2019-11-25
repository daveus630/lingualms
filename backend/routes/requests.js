const express = require("express");
const router = express.Router();

const RequestController = require("../controllers/requestController");

router.post("/applyLeave", RequestController.applyLeave);
router.get("/getAllLeaveType", RequestController.getAllLeaveType);
router.get("/getRequestsByAgentId/:id", RequestController.getRequestsByAgentId);
router.delete("/cancelLeaveRequest", RequestController.cancelLeaveRequest);

module.exports = router;

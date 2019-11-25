const express = require("express");
const router = express.Router();

const AgentController = require("../controllers/agentController");

router.get("/getAllAgents", AgentController.getAllAgents);
router.get("/getAgentById/:id", AgentController.getAgentById);
router.get("/getAgentUsedDates/:id", AgentController.getAgentUsedDates);
router.get("/getAgentsCalendar", AgentController.getAgentsCalendar);
router.post("/addAgent", AgentController.addAgent);
router.put("/updateAgent/:id", AgentController.updateAgent);
router.delete("/deleteAgent/:id", AgentController.deleteAgent);

module.exports = router;

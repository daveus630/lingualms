const express = require("express");
const router = express.Router();

const SupervisorController = require("../controllers/supervisorController");

router.post("/add", SupervisorController.addSupervisor);
router.get("/getAllSupervisor", SupervisorController.getAllSupervisor);
router.get("/reqlist/:id", SupervisorController.getSupervisorRequestById);
router.delete("/delete/:id", SupervisorController.deleteSupervisor);
router.get("/acknowledge", SupervisorController.acknowledgeRequest);

module.exports = router;

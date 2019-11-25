const express = require("express");
const router = express.Router();

const ProjectController = require("../controllers/projectController");

router.post("/addProject", ProjectController.addProject);
router.get("/getAllProjects", ProjectController.getAllProjects);
router.delete("/delete", ProjectController.deleteProject);

module.exports = router;

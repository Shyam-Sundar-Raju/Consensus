const express = require("express");
const router = express.Router();
const {
    createProject,
    getProjects,
    deleteProject
  } = require("../controllers/project.controller");
  

const authMiddleware = require("../middleware/auth.middleware");

// Protected routes
router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.delete("/:projectId", authMiddleware, deleteProject);

module.exports = router;

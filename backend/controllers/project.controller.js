const Project = require("../models/Project");
const Chunk = require("../models/Chunk");
const Message = require("../models/Message");


// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ message: "Name and level required" });
    }

    const project = new Project({
      name,
      level,
      userId: req.userId
    });

    await project.save();

    res.status(201).json(project);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LIST PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(projects);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PROJECT
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    // 1. Find project and check ownership
    const project = await Project.findOne({
      _id: projectId,
      userId: userId
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    // 2. Delete related data
    await Chunk.deleteMany({ projectId });
    await Message.deleteMany({ projectId });

    // 3. Delete project itself
    await Project.deleteOne({ _id: projectId });

    res.json({ message: "Project deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

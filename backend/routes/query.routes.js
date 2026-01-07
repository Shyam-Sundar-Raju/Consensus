const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { askQuestion } = require("../controllers/query.controller");

router.post("/:projectId", authMiddleware, askQuestion);

module.exports = router;

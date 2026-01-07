const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Chunk", chunkSchema);

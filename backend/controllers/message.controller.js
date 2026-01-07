const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const messages = await Message.find({ projectId })
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

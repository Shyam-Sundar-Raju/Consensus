const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
const messageRoutes = require("./routes/message.routes");



require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
  });


app.use(cors());
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const uploadRoutes = require("./routes/upload.routes");
const queryRoutes = require("./routes/query.routes");




// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/upload", uploadRoutes);
app.use("/query", queryRoutes);
app.use("/messages", messageRoutes);

// DB + Server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch(err => console.log(err));

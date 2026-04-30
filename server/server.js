require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courses/:courseId/sessions", sessionRoutes);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection errro:", err);
    process.exit(1);
  }
};

connectDb();

app.use((req, res) => {
  console.log(`Unmatched ${req.method} request to: ${req.url}`);
  res.status(404).send(`Route ${req.method} ${req.url} not found on this server`);
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});

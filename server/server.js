require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const errorHandler = require("./middlewares/errorHandlerMiddleware");

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);
app.use(helmet());
app.use(express.json({ limit: "25kb" }));

const floodGuard = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});
app.use(floodGuard);

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courses/:courseId/sessions", sessionRoutes);

app.use((req, res) => {
  res.status(404).send(`Route ${req.method} ${req.url} not found on this server`);
});

app.use(errorHandler);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDb();
  app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on port: ${process.env.PORT}`);
  });
};

startServer();
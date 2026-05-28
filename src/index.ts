import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// ROUTES
import customerRouter from "./routers/customerRouter";
import userRouter from "./routers/userRouters";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const DB_URL =
  process.env.DB_URL || "mongodb://127.0.0.1:27017/customer_db";

// ✅ FIXED CORS (IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rad-service-fe.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

// ROUTES
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/auth", userRouter);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// DB CONNECT
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });
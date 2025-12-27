// src/app.js
import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import router from "./routes/index.js";
import authRoutes from "./routes/authRoutes.js";

import weatherTestRoutes from "./routes/weatherTestRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";




const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true, env: config.NODE_ENV });
});



app.use("/api", weatherTestRoutes);

// 🔐 auth routes
app.use("/api/auth", authRoutes);

// 🔹 rest of API
app.use("/api", router);


app.use("/api", supportRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

export default app;

import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { findUserById } from "../routes/authRoutes.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET || "dev-secret");
   const user = findUserById(payload.id, payload.email);


    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // 👈 attach user to request
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

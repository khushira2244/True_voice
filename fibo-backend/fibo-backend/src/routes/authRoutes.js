import { Router } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

const router = Router();

const DEMO_PASSWORD = config.DEMO_PASSWORD || "demo123";

function generateToken({ id, email }) {
  return jwt.sign(
    { id, email },
    config.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );
}

// ❌ Disable register
router.post("/register", (req, res) => {
  return res.status(403).json({
    error: "Register disabled for demo. Use any email + demo password.",
  });
});

// ✅ Login: any email + demo password
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  if (password !== DEMO_PASSWORD) {
    return res.status(400).json({ error: "invalid email or password" });
  }

  // ✅ stable id derived from email (restart-proof)
  const cleanEmail = String(email).trim().toLowerCase();
  const id = `demo:${cleanEmail}`;

  const token = generateToken({ id, email: cleanEmail });

  return res.json({
    ok: true,
    user: { id, email: cleanEmail },
    token,
  });
});

// ✅ stateless user reconstruction
export function findUserById(id, email) {
  if (!id || !email) return null;
  return { id, email };
}

export default router;

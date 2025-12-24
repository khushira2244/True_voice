// src/routes/sosRoutes.js
import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { generateWithFibo } from "../services/fiboService.js";
import { buildSosPrompt } from "../flows/sosFlow.js";

const router = Router();

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

// POST /api/sos
router.post("/sos", requireAuth, async (req, res) => {
  const { hero, placeLabel } = req.body || {};
  if (!hero) return badRequest(res, "hero is required");

  const prompt = buildSosPrompt({ hero, placeLabel });

  try {
    const imageUrl = await generateWithFibo(prompt, {
      aspect_ratio: "4:3",
      width: 1000,
      height: 500,
    });

    return res.json({
      ok: true,
      step: "sos",
      hero,
      placeLabel: placeLabel || null,
      prompt,
      imageUrl,
    });
  } catch (err) {
    console.error("SOS FIBO generation error:", err);
    return res.status(500).json({ error: "Failed to generate SOS image" });
  }
});

export default router;

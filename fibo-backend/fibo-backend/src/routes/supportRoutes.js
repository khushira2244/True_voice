// src/routes/supportRoutes.js
import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { generateWithFibo } from "../services/fiboService.js";
import { buildSupportPrompt } from "../flows/supportFlow.js";

const router = Router();

function badRequest(res, message) {
  return res.status(400).json({ ok: false, error: message });
}

// POST /api/support/generate
router.post("/support/generate", requireAuth, async (req, res) => {
  const { supportKey, headerText, sceneGuidance, promptMeta } = req.body || {}; // ✅ include

  if (!promptMeta?.heroId || !promptMeta?.scenarioId || !promptMeta?.symptomId || !promptMeta?.severityId) {
    return badRequest(res, "promptMeta.heroId, scenarioId, symptomId, severityId are required");
  }

  const prompt = buildSupportPrompt({ supportKey, headerText, sceneGuidance, promptMeta }); // ✅ pass it

  try {
    const imageUrl = await generateWithFibo(prompt, {
      aspect_ratio: "4:3",
      width: 1000,
      height: 500,
    });

    return res.json({
      ok: true,
      step: "support_generate",
      supportKey: supportKey || null,
      headerText: headerText || "Support / Sympathy Image",
      sceneGuidance: sceneGuidance || null, // (optional) return it for debugging
      promptMeta,
      prompt,
      imageUrl,
    });
  } catch (err) {
    console.error("Support FIBO generation error:", err);
    return res.status(500).json({ ok: false, error: "Failed to generate support image" });
  }
});

export default router;

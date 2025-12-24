import { Router } from "express";
import { config } from "../config/env.js";

// 🔹 Flow config (medical + FIBO snippets)
import { HERO_SCENARIO_SYMPTOM_PROMPTS } from "../flows/medicalTree.js";
import { buildSosPrompt } from "../flows/sosFlow.js";


// 🔹 Heroes + scenarios
import { HERO_OPTIONS } from "../flows/heroOptions.js";
import { HERO_SCENARIO_PROMPTS } from "../flows/scenarioOptions.js";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { createEpisode } from "./episodeRoutes.js";
import { getCurrentWeatherText } from "../services/weatherService.js";

import { HERO_SCENARIO_SYMPTOM_WITH_SRVERITY_PROMPTS } from "../flows/medicalFlowConfig.js";

// 🔹 Services
import { generateWithFibo } from "../services/fiboService.js";

async function getWeatherSafe() {
  // try {
  //   return await getCurrentWeatherText({
  //     lat: config.WEATHER_LAT,
  //     lon: config.WEATHER_LON,
  //   });
  // } catch (e) {
  //   console.warn("Weather fetch failed, continuing without it:", e?.message);
    return "Weather:rainy";
  
}

const router = Router();

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

async function generateImageAndRespond(res, { prompt, meta = {}, options = {} }) {
  try {
    const imageUrl = await generateWithFibo(prompt, {
      aspect_ratio: "4:3",
      ...options,
    });

    return res.json({
      imageUrl,
      prompt,
      ...meta,
    });
  } catch (err) {
    console.error("FIBO generation error:", err);
    return res.status(500).json({ error: "Failed to generate image" });
  }
}

/**
 * ✅ HERO STEP (your logic)
 * 1) Frontend mounts hero screen -> GET /api/hero
 *    Backend generates BOTH hero images (FIBO x2) and returns list
 *
 * 2) User clicks one hero -> POST /api/hero
 *    Backend only accepts selection (NO FIBO call)
 */

// ✅ PROTECTED: Generate BOTH hero images for selection UI
router.get("/hero", requireAuth, async (req, res) => {
  try {
    const heroes = [];

    for (const h of HERO_OPTIONS) {
      if (!h?.id || !h?.basePrompt) continue;

      const imageUrl = await generateWithFibo(h.basePrompt, {
        aspect_ratio: "4:3",
        width: 1000,
        height: 500,
      });

      heroes.push({
        id: h.id,
        label: h.label,
        ageGroup: h.ageGroup,
        region: h.region,
        description: h.description,
        imageUrl,
      });
    }

    if (!heroes.length) {
      return res.status(500).json({ error: "No heroes available" });
    }

    return res.json({ step: "hero", heroes });
  } catch (err) {
    console.error("Hero list generation failed:", err);
    return res.status(500).json({ error: "Failed to generate hero options" });
  }
});

// ✅ PROTECTED: Accept selected hero (NO image generation here)
router.post("/hero", requireAuth, async (req, res) => {
  const { hero } = req.body || {};
  if (!hero) return badRequest(res, "hero is required");

  const heroConfig = HERO_OPTIONS.find((h) => h.id === hero);
  if (!heroConfig) {
    return res.status(404).json({ error: "Hero not found" });
  }

  return res.json({
    ok: true,
    step: "hero",
    hero,
    nextStep: "scenario",
  });
});

// ✅ PROTECTED
router.post("/scenario", requireAuth, async (req, res) => {
  const { hero, scenario } = req.body || {};
  if (!hero || !scenario) return badRequest(res, "hero and scenario are required");

  // ✅ FIX: scenarioOptions.js is { id, prompts: { outside, school, home } }
  const heroScenario = HERO_SCENARIO_PROMPTS.find((h) => h.id === hero);
  const basePrompt = heroScenario?.prompts?.[scenario];

  if (!basePrompt) {
    return res.status(404).json({ error: "Scenario prompt not found" });
  }

  const weatherText = await getWeatherSafe();
  const prompt = weatherText ? `${basePrompt} ${weatherText}` : basePrompt;

  return generateImageAndRespond(res, {
    prompt,
    meta: { step: "scenario", hero, scenario, weather: weatherText || null },
  });
});


router.post("/symptom", requireAuth, async (req, res) => {
  const { hero, scenario, symptom } = req.body || {};
  if (!hero || !scenario || !symptom) {
    return badRequest(res, "hero, scenario and symptom are required");
  }

  const symptomConfig = HERO_SCENARIO_SYMPTOM_PROMPTS.find(
    (item) => item.hero === hero && item.scenario === scenario && item.symptom === symptom
  );
  if (!symptomConfig?.basePrompt) {
    return res.status(404).json({ error: "Symptom prompt not found" });
  }

  const weatherText = await getWeatherSafe();
  const prompt = weatherText ? `${symptomConfig.basePrompt} ${weatherText}` : symptomConfig.basePrompt;

  
  const isEmergency =
    symptom === "breathing_or_choking" || symptom === "big_hurt_or_bleeding";

  try {
    const imageUrl = await generateWithFibo(prompt, {
      aspect_ratio: "4:3",
      width: 1000,
      height: 500,
    });

    if (isEmergency) {
      const episode = createEpisode({
        userId: req.user.id,
        hero,
        scenario,
        symptom,
        severity: "emergency",
        prompt,
        imageUrl,
        weather: weatherText || null,
      });

      return res.json({
        imageUrl,
        prompt,
        weather: weatherText || null,
        step: "symptom",
        hero,
        scenario,
        symptom,
        emergency: true,
        nextStep: "episodes",
        episodeId: episode.id,
      });
    }

    return res.json({
      imageUrl,
      prompt,
      weather: weatherText || null,
      step: "symptom",
      hero,
      scenario,
      symptom,
      emergency: false,
      nextStep: "severity",
    });
  } catch (err) {
    console.error("FIBO generation error:", err);
    return res.status(500).json({ error: "Failed to generate image" });
  }
});


// ✅ PROTECTED: SOS image generation (confidence UI image)
router.post("/sos", requireAuth, async (req, res) => {
  const { hero, placeLabel } = req.body || {};

  if (!hero) return badRequest(res, "hero is required");

  // placeLabel can be optional (fallback exists in builder)
  const prompt = buildSosPrompt({ hero, placeLabel });

  try {
    // keep SAME generation style as your other endpoints
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


// ✅ already protected
router.post("/severity", requireAuth, async (req, res) => {
  const { hero, scenario, symptom, severity } = req.body || {};

  if (!hero || !scenario || !symptom || !severity) {
    return badRequest(res, "hero, scenario, symptom and severity are required");
  }

  const severityConfig = HERO_SCENARIO_SYMPTOM_WITH_SRVERITY_PROMPTS.find(
    (item) =>
      item.hero === hero &&
      item.scenario === scenario &&
      item.symptom === symptom &&
      item.severity === severity
  );

  if (!severityConfig?.basePrompt) {
    return res.status(404).json({ error: "Severity prompt not found" });
  }

  const weatherText = await getWeatherSafe();
  const prompt = weatherText
    ? `${severityConfig.basePrompt} ${weatherText}`
    : severityConfig.basePrompt;

  try {
    const imageUrl = await generateWithFibo(prompt, { aspect_ratio: "1:1" });

    const episode = createEpisode({
      userId: req.user.id,
      hero,
      scenario,
      symptom,
      severity,
      prompt,
      imageUrl,
      weather: weatherText || null,
    });

    return res.json({
      imageUrl,
      prompt,
      weather: weatherText || null,
      step: "severity",
      hero,
      scenario,
      symptom,
      severity,
      nextStep: "episodes",
      episodeId: episode.id,
    });
  } catch (err) {
    console.error("FIBO generation error:", err);
    return res.status(500).json({ error: "Failed to generate image" });
  }
});

export default router;

import { Router } from "express";

// 🔹 Flow config (medical + FIBO snippets)
import { HERO_SCENARIO_SYMPTOM_PROMPTS } from "../flows/medicalTree.js";

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
  try {
    return await getCurrentWeatherText({
      lat: config.WEATHER_LAT,
      lon: config.WEATHER_LON,
    });
  } catch (e) {
    console.warn("Weather fetch failed, continuing without it:", e?.message);
    return "";
  }
}


const router = Router();

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

async function generateImageAndRespond(res, { prompt, meta = {}, options = {} }) {
  try {
    const imageUrl = await generateWithFibo(prompt, {
      aspect_ratio: "4:3",
      width: 1000,
      height: 500,
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

// ✅ PROTECTED
router.post("/hero", requireAuth, async (req, res) => {
  const { hero } = req.body || {};

  if (!hero) return badRequest(res, "hero is required");

  const heroConfig = HERO_OPTIONS.find((h) => h.id === hero);
  if (!heroConfig?.basePrompt) {
    return res.status(404).json({ error: "Hero or hero prompt not found" });
  }

  return generateImageAndRespond(res, {
    prompt: heroConfig.basePrompt,
    meta: { step: "hero", hero },
  });
});

// ✅ PROTECTED
router.post("/scenario", requireAuth, async (req, res) => {
  const { hero, scenario } = req.body || {};
  if (!hero || !scenario) return badRequest(res, "hero and scenario are required");

  const scenarioConfig = HERO_SCENARIO_PROMPTS.find(
    (item) => item.hero === hero && item.scenario === scenario
  );
  if (!scenarioConfig?.basePrompt) {
    return res.status(404).json({ error: "Scenario prompt not found" });
  }

  const weatherText = await getWeatherSafe();
  const prompt = weatherText
    ? `${scenarioConfig.basePrompt} ${weatherText}`
    : scenarioConfig.basePrompt;

  return generateImageAndRespond(res, {
    prompt,
    meta: { step: "scenario", hero, scenario, weather: weatherText || null },
  });
});

// ✅ PROTECTED
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
  const prompt = weatherText
    ? `${symptomConfig.basePrompt} ${weatherText}`
    : symptomConfig.basePrompt;

  return generateImageAndRespond(res, {
    prompt,
    meta: { step: "symptom", hero, scenario, symptom, weather: weatherText || null },
  });
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

  // ✅ fetch weather safely (don’t crash if API fails)
  let weatherText = "";
  try {
    weatherText = await getCurrentWeatherText({
      lat: config.WEATHER_LAT,
      lon: config.WEATHER_LON,
    });
  } catch (e) {
    console.warn("Weather fetch failed, continuing without it:", e?.message);
  }

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
      weather: weatherText || null, // optional: store weather too
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
      episodeId: episode.id,
    });
  } catch (err) {
    console.error("FIBO generation error:", err);
    return res.status(500).json({ error: "Failed to generate image" });
  }
});


export default router;

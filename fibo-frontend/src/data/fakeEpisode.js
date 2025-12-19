// src/data/fakeEpisode.js
import { HEROES } from "./heroes";

export const EPISODE_KEY = "truevoice_episodes";

// ✅ heroes come from your real data
const HERO_IDS = (HEROES || []).map((h) => h.id).filter(Boolean);

// same for both heroes (as per your flow)
const SCENARIOS = ["home", "school", "outside"];

// body parts / problem areas (as per your flow)
const SYMPTOMS = [
  "head",
  "chest",
  "stomach",
  "throat",
  "arm",
  "leg",
  "back",
  "breathing", // trouble breathing / choking
  "bleeding",  // big hurt or bleeding
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function severityFor(symptomId) {
  if (symptomId === "breathing" || symptomId === "bleeding") {
    return Math.random() < 0.8 ? "severe" : "mild";
  }
  return Math.random() < 0.6 ? "mild" : "severe";
}

export function buildFakeEpisodes({ count = 20 } = {}) {
  const heroes = HERO_IDS.length ? HERO_IDS : ["ava_child"]; // fallback safe
  const episodes = [];
  const now = Date.now();

  // pools for diversity
  const scenarioPool = [];
  while (scenarioPool.length < count) scenarioPool.push(...SCENARIOS);

  const symptomPool = [];
  while (symptomPool.length < count) symptomPool.push(...shuffle(SYMPTOMS));

  // force variety in first 10
  const first10Scenario = shuffle(SCENARIOS);
  const criticalFirst = Math.random() < 0.5 ? "breathing" : "bleeding";

  for (let i = 0; i < count; i++) {
    const heroId = heroes[i % heroes.length];

    let scenarioId = scenarioPool[i];
    let symptomId = symptomPool[i];

    if (i < 3) scenarioId = first10Scenario[i]; // ensure all 3 scenarios appear
    if (i === 3) symptomId = criticalFirst;
    if (i === 4) symptomId = criticalFirst === "breathing" ? "bleeding" : "breathing";

    const severityId = severityFor(symptomId);

    episodes.push({
      id: `ep_${String(i + 1).padStart(3, "0")}`,
      heroId,
      scenarioId,
      symptomId,
      severityId,
      savedAt: new Date(now - i * 6 * 60 * 60 * 1000).toISOString(),
      source: "demo",
    });
  }

  return episodes;
}

export function seedFakeEpisodes({ count = 20 } = {}) {
  const eps = buildFakeEpisodes({ count });
  localStorage.setItem(EPISODE_KEY, JSON.stringify(eps));
  return eps;
}

export function loadEpisodes() {
  try {
    return JSON.parse(localStorage.getItem(EPISODE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearEpisodes() {
  localStorage.removeItem(EPISODE_KEY);
}

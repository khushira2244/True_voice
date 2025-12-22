import {
  HERO_SCENARIO_,
  HERO_SCENARIO_SYMPTOMS,
  HERO_SCENARIO_SYMPTOM_WITH_SRVERITY,
} from "../../data/heroes";

export function getScenarioItems(heroId) {
  const obj = HERO_SCENARIO_?.[heroId];
  if (!obj) return [];
  return Object.keys(obj).map((k) => ({ id: k, imageUrl: obj[k].imageUrl }));
}

export function getSymptomItems(heroId, scenarioId) {
  const obj = HERO_SCENARIO_SYMPTOMS?.[heroId]?.[scenarioId];
  if (!obj) return [];
  return Object.keys(obj).map((k) => ({ id: k, imageUrl: obj[k].imageUrl }));
}

// kept even if unused (same as App.jsx)
export function normalizeSymptomKey(id) {
  if (!id) return id;
  return id.replace("_pain", "");
}

export function getSeverityItems({ heroId, scenarioId, symptomId, pendingSymptomId }) {
  const sId = pendingSymptomId || symptomId;

  if (!heroId || !scenarioId || !sId) return [];

  const node = HERO_SCENARIO_SYMPTOM_WITH_SRVERITY?.[heroId]?.[scenarioId]?.[sId];

  const img = node?.severe?.imageUrl || node?.imageUrl;
  if (!img) return [];

  return [{ id: "severe", imageUrl: img }];
}

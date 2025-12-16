// src/services/episodeService.js
import {
  BODY_AREAS,
  NON_SPECIFIC_CLUSTERS,
  FEELINGS_BY_BODY_AREA,
  INTENSITY_LEVELS
} from "../flows/medicalFlowConfig.js";
import { HERO_OPTIONS } from "../flows/heroOptions.js";
import {
  SCENARIO_OPTIONS,
  EXTRA_SCENARIO_OPTIONS
} from "../flows/scenarioOptions.js";

import { buildStepPromptAndOptions } from "./stepPromptService.js";
import { generateWithFibo } from "../services/fiboService.js"
import { createEpisode } from "../models/episodeModel.js";
import {
  saveEpisode,
  listEpisodes as repoListEpisodes,
  findEpisodeById
} from "../repositories/episodeRepository.js";

// ---------- helpers ----------

function findById(list, id) {
  return list.find((item) => item.id === id) || null;
}

function findBodyAreaLabel(bodyAreaId) {
  if (!bodyAreaId) return null;
  const area = findById(BODY_AREAS, bodyAreaId);
  return area?.label || null;
}

function findClusterLabel(clusterId) {
  if (!clusterId) return null;
  const cluster = findById(NON_SPECIFIC_CLUSTERS, clusterId);
  return cluster?.label || null;
}

function findFeelingLabel(bodyAreaId, feelingId) {
  if (!bodyAreaId || !feelingId) return null;
  const list = FEELINGS_BY_BODY_AREA[bodyAreaId] || [];
  const f = findById(list, feelingId);
  return f?.label || null;
}

function findIntensityLabel(intensityId) {
  if (!intensityId) return null;
  const lvl = findById(INTENSITY_LEVELS, intensityId);
  return lvl?.childLabel || lvl?.label || null;
}

function getScenarioLabel(scenarioId) {
  if (!scenarioId) return null;
  const all = [...SCENARIO_OPTIONS, ...EXTRA_SCENARIO_OPTIONS];
  const s = findById(all, scenarioId);
  return s?.label || null;
}

function getHeroName(heroId) {
  if (!heroId) return "The hero";
  const h = findById(HERO_OPTIONS, heroId);
  return h?.childName || h?.label || "The hero";
}

// Build one-line summary for parent / doctor
function buildSummaryText(state) {
  const {
    heroId,
    scenarioId,
    bodyAreaId,
    clusterId,
    feelingId,
    intensityId
  } = state;

  const heroName = getHeroName(heroId);
  const placeLabel = getScenarioLabel(scenarioId);
  const bodyLabel = findBodyAreaLabel(bodyAreaId);
  const clusterLabel = findClusterLabel(clusterId);
  const feelingLabel = findFeelingLabel(bodyAreaId, feelingId);
  const intensityLabel = findIntensityLabel(intensityId);

  const wherePart = placeLabel
    ? ` at ${placeLabel.toLowerCase()}`
    : "";

  let whatPart = "";

  if (bodyLabel && feelingLabel) {
    whatPart = `${bodyLabel.toLowerCase()} feels ${feelingLabel.toLowerCase()}`;
  } else if (clusterLabel) {
    whatPart = clusterLabel.toLowerCase();
  } else {
    whatPart = "not feeling okay";
  }

  if (intensityLabel) {
    whatPart = `${whatPart}, ${intensityLabel.toLowerCase()}`;
  }

  return `${heroName}${wherePart} is ${whatPart}.`;
}

// ---------- main API ----------

/**
 * Create final hero card from episode state:
 *  - build summary
 *  - build FIBO prompt (final_card mode)
 *  - call FIBO
 *  - save episode in memory
 */
export async function createEpisodeFinalCard(state) {
  // 1) Summary text
  const summaryText = buildSummaryText(state);

  // 2) Build prompt for final hero card
  const plannerDecision = {
    nextStep: "finish",
    imageMode: "final_card"
  };

  const prompt = buildStepPromptAndOptions(state, plannerDecision);

  // 3) Call FIBO
  const imageUrl = await generateWithFibo(prompt);

  // 4) Create + save episode
  const episode = createEpisode(state, summaryText, imageUrl);
  const saved = saveEpisode(episode);

  return {
    episode: saved,
    summaryText,
    imageUrl
  };
}

// Simple passthroughs for listing/reading
export function listEpisodes() {
  return repoListEpisodes();
}

export function getEpisodeById(id) {
  return findEpisodeById(id);
}

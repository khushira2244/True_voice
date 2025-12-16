// src/services/stepPromptService.js
import {
  FIBO_BASE_STYLE,
  FIBO_SCENARIO_SNIPPETS,
  FIBO_CLUSTER_SNIPPETS,
  FIBO_FEELING_SNIPPETS,
  BEHAVIOUR_OPTIONS
} from "../flows/medicalFlowConfig.js";
import { HERO_OPTIONS } from "../flows/heroOptions.js";
import {
  SCENARIO_OPTIONS,
  EXTRA_SCENARIO_OPTIONS
} from "../flows/scenarioOptions.js";

/**
 * Build a single FIBO /generate prompt
 * based on current state + planner decision.
 *
 * @param {object} state
 * @param {{nextStep: string, imageMode: string}} plannerDecision
 * @returns {string} promptText
 */
export function buildStepPromptAndOptions(state, plannerDecision) {
  const {
    heroId,
    scenarioId,
    bodyAreaId,
    feelingId,
    clusterId,
    behaviourIds
  } = state;
  const { nextStep, imageMode } = plannerDecision;

  const hero = HERO_OPTIONS.find((h) => h.id === heroId);
  const allScenarios = [...SCENARIO_OPTIONS, ...EXTRA_SCENARIO_OPTIONS];
  const scenario = allScenarios.find((s) => s.id === scenarioId);

  const heroDesc =
    hero?.fiboBasePrompt ||
    "a child hero character, same every time, in friendly child-safe style";

  const scenarioSnippet = scenario
    ? FIBO_SCENARIO_SNIPPETS[scenario.id] || ""
    : "";

  const parts = [
    FIBO_BASE_STYLE,
    `Show ${heroDesc}`,
    scenarioSnippet && `, ${scenarioSnippet}`
  ];

  // Non-specific cluster (sensory overload, just tired, sad inside, etc.)
  if (clusterId) {
    const clusterSnippet = FIBO_CLUSTER_SNIPPETS[clusterId];
    if (clusterSnippet) parts.push(`. ${clusterSnippet}`);
  }

  // Body feeling (tight chest, burning tummy, ache, etc.)
  if (feelingId) {
    const feelingSnippet = FIBO_FEELING_SNIPPETS[feelingId];
    if (feelingSnippet) parts.push(`. ${feelingSnippet}`);
  }

  // Behaviours (covering ears, hiding, pacing…)
  if (behaviourIds && behaviourIds.length > 0) {
    const behaviourById = Object.fromEntries(
      BEHAVIOUR_OPTIONS.map((b) => [b.id, b])
    );

    behaviourIds.forEach((bid) => {
      const b = behaviourById[bid];
      if (b?.fiboSnippet) {
        parts.push(`. ${b.fiboSnippet}`);
      }
    });
  }

  // Micro vs final flavour
  if (imageMode === "micro_option" && nextStep === "ask_intensity") {
    parts.push(
      ". Create three small panels of the SAME hero in this same place: a little upset, medium upset, and very upset, child-friendly style, clearly different facial expressions."
    );
  }

  if (imageMode === "final_card") {
    parts.push(
      ". Make one clear scene that shows how the hero feels right now, calm and safe overall, easy for a child to point at."
    );
  }

  return parts.filter(Boolean).join(" ");
}

// src/flows/supportFlow.js

const HERO_NAME_MAP = {
  ava_child: "AVA",
  leo_child: "LEO",
};

const HERO_GENDER = {
  ava_child: "girl",
  leo_child: "boy",
};

const SCENARIO_LABEL = {
  outside: "Outside",
  school: "School",
  home: "Home",
};

const SYMPTOM_LABEL = {
  head: "head pain",
  chest: "chest discomfort",
  stomach: "stomach pain",
  throat: "throat pain",
  arm: "arm pain",
  leg: "leg pain",
  back: "back pain",
  breathing_or_choking: "breathing difficulty",
  big_hurt_or_bleeding: "injury",
};

function safeText(x) {
  return typeof x === "string" ? x.trim() : "";
}

export function buildSupportPrompt({ supportKey, headerText, sceneGuidance, promptMeta }) {
  const heroId = safeText(promptMeta?.heroId);
  const scenarioId = safeText(promptMeta?.scenarioId);
  const symptomId = safeText(promptMeta?.symptomId);
  const severityId = safeText(promptMeta?.severityId);

  const heroName = HERO_NAME_MAP[heroId] || "CHILD";
  const heroGender = HERO_GENDER[heroId] || "child";

  const scenarioLabel = SCENARIO_LABEL[scenarioId] || scenarioId || "Place";
  const symptomLabel = SYMPTOM_LABEL[symptomId] || symptomId || "pain";
  const severityLabel = severityId || "mild";

  // style knobs (optional)
  const mood = safeText(promptMeta?.mood) || "comforting";
  const cameraAngle = safeText(promptMeta?.cameraAngle) || "soft-focus";
  const colorPalette = safeText(promptMeta?.colorPalette) || "warm tones";
  const lighting = safeText(promptMeta?.lightingPreset) || "soft indoor daylight";

  // parent written
 

  // not used in prompt (UI only)
  void supportKey;
  void headerText;

 // parent written
const guidance = safeText(sceneGuidance);

// If parent provided guidance, strongly encourage the model to include the helper described in guidance.
// NOT "teacher". Just "helper/adult" generically.
const helperRequired = guidance
  ? "Two-person scene: the child and the helping adult described below must both be visible in the same frame. Do not show the child alone. "
  : "";

return (
  `${helperRequired}` +
  `Show the child hero '${heroName}', a 6-year-old autistic ${heroGender}, seated calmly and holding the ${symptomLabel} area gently. ` +
  (guidance ? `${guidance} ` : "") +
  `Severity: ${severityLabel}. ` +
  `Context: ${scenarioLabel}. ` +
  `Soft, non-vibrant cartoon style. Calm, safe, ${mood}. Minimal background. ${cameraAngle}. ${colorPalette}. ${lighting}.`
);
}

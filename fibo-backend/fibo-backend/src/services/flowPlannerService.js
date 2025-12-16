// src/services/flowPlannerService.js
import { openai, OPENAI_MODEL } from "../config/openaiClient.js";
import {
  ALLOWED_NEXT_STEPS,
  ALLOWED_IMAGE_MODES
} from "../flows/medicalFlowConfig.js";

/**
 * Use OpenAI to decide:
 *  - next_step: ask_feeling | ask_intensity | ask_behaviour | finish
 *  - image_mode: none | micro_option | final_card
 *
 * @param {object} episodeState
 * @returns {Promise<{nextStep: string, imageMode: string}>}
 */
export async function decideNextStepAndImage(episodeState) {
  const allowedNextSteps = ALLOWED_NEXT_STEPS;
  const allowedImageModes = ALLOWED_IMAGE_MODES;

  const response = await openai.responses.create({
    model: OPENAI_MODEL,
    input: [
      {
        role: "system",
        content: `
You are a SAFE flow planner for an autism-friendly child communication app.
You NEVER diagnose, mention diseases, or suggest treatment.
You ONLY decide the next UI step and whether to show an image.

You MUST return JSON with two fields:
  - "next_step": one of [${allowedNextSteps.join(", ")}]
  - "image_mode": one of [${allowedImageModes.join(", ")}]

"ask_feeling"   = ask what kind of feeling (tight, burning, sad, etc.).
"ask_intensity" = ask how strong it is (a little, medium, a lot).
"ask_behaviour" = ask which behaviour is happening (covering ears, hiding, etc.).
"finish"        = move to final summary / hero card.

"none"          = no image for this step.
"micro_option"  = generate step images (e.g. three levels) to help choose.
"final_card"    = generate final hero scene.

If you are unsure, use:
  "next_step": "finish"
  "image_mode": "final_card"
`
      },
      {
        role: "user",
        content: JSON.stringify({
          state: episodeState,
          allowed_next_steps: allowedNextSteps,
          allowed_image_modes: allowedImageModes
        })
      }
    ],
    response_format: { type: "json_object" }
  });

  let nextStep = "finish";
  let imageMode = "none";

  try {
    const raw = response.output[0].content[0].text;
    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed.next_step === "string") {
      nextStep = parsed.next_step;
    }
    if (parsed && typeof parsed.image_mode === "string") {
      imageMode = parsed.image_mode;
    }
  } catch (e) {
    // fall back to defaults
  }

  // Final safety clamps
  if (!ALLOWED_NEXT_STEPS.includes(nextStep)) {
    nextStep = "finish";
  }
  if (!ALLOWED_IMAGE_MODES.includes(imageMode)) {
    imageMode = "none";
  }

  return { nextStep, imageMode };
}

// src/services/fiboService.js
import { fal } from "../config/falClient.js";

/**
 * Call FIBO /generate with full control over parameters.
 *
 * You can call either:
 *   generateWithFibo("some prompt", { aspect_ratio: "1:1", ... })
 * or:
 *   generateWithFibo({ prompt: "some prompt", aspect_ratio: "1:1", ... })
 *
 * @returns {Promise<string|null>} imageUrl
 */
export async function generateWithFibo(promptOrInput, extraOptions = {}) {
  let input;

  if (typeof promptOrInput === "string") {
    input = {
      prompt: promptOrInput,
      ...extraOptions
    };
  } else if (promptOrInput && typeof promptOrInput === "object") {
    input = { ...promptOrInput };
  } else {
    throw new Error(
      "generateWithFibo: first argument must be a string or an object"
    );
  }

  const result = await fal.subscribe("bria/fibo/generate", {
    input,
    logs: false
  });

  const data = result?.data || {};

  const imageUrl =
    data.image?.url ||
    data.image_url ||
    data.images?.[0]?.url ||
    data.images?.[0] ||
    null;

  return imageUrl;
}

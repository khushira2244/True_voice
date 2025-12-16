// example: src/services/heroImageService.js
import { HERO_OPTIONS } from "../flows/heroOptions.js";
import { generateWithFibo } from "./fiboService.js";

export async function generateAllHeroImages() {
  for (const hero of HERO_OPTIONS) {
    try {
      const imageUrl = await generateWithFibo({
        prompt: hero.basePrompt,   // 🔴 use hero-specific basePrompt
        aspect_ratio: "4:3",       // tablet-friendly frame
        steps_num: 40,
        guidance_scale: 5,
        // optional: seed: 5555  // if you want fixed output
      });

      hero.imageUrl = imageUrl;   // frontend already reads currentHero.imageUrl
      console.log(`Generated hero image for ${hero.id}:`, imageUrl);
    } catch (err) {
      console.error(`Failed to generate hero ${hero.id}`, err);
    }
  }
}

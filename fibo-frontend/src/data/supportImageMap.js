// src/app/data/supportImageMap.js


// src/app/data/supportHeaderMap.js
export const SUPPORT_HEADER_MAP = {
  "ava_child__school__stomach__severe": "I’m here with you. You’re safe.",
  "leo_child__home__head__severe": "Breathe… I’m with you. It will pass.",
};


// {
//     "ok": true,
//     "step": "support_generate",
//     "supportKey": "ava_child__school__stomach__severe",
//     "headerText": "It’s okay, I’m here with you.",
//     "sceneGuidance": "A kind female school teacher is clearly visible sitting beside the child on a chair, gently supporting her with one hand on the shoulder. Both teacher and child must be in the frame. Classroom desks and books in background.",
//     "promptMeta": {
//         "heroId": "ava_child",
//         "scenarioId": "school",
//         "symptomId": "stomach",
//         "severityId": "severe",
//         "mood": "comforting",
//         "cameraAngle": "soft-focus",
//         "colorPalette": "warm tones",
//         "lightingPreset": "soft indoor classroom daylight"
//     },
//     "prompt": "Two-person scene: the child and the helping adult described below must both be visible in the same frame. Do not show the child alone. Show the child hero 'AVA', a 6-year-old autistic girl, seated calmly and holding the stomach pain area gently. A kind female school teacher is clearly visible sitting beside the child on a chair, gently supporting her with one hand on the shoulder. Both teacher and child must be in the frame. Classroom desks and books in background. Severity: severe. Context: School. Soft, non-vibrant cartoon style. Calm, safe, comforting. Minimal background. soft-focus. warm tones. soft indoor classroom daylight.",
//     "imageUrl": "https://v3b.fal.media/files/b/0a87f965/XHXNQeUKU_gJn3PQ0yVt6_cb2a00d712234755a5bfd81f58440bf7.png"
// }

// {
//     "ok": true,
//     "step": "support_generate",
//     "supportKey": "ava_child__home__stomach__severe",
//     "headerText": "It’s okay, you’re safe.",
//     "sceneGuidance": "A kind nanny is clearly visible sitting beside the child at home, gently supporting her with a calm posture. The nanny looks caring and attentive, helping the child feel safe and relaxed. A simple home setting is visible with a sofa or bed and soft household items in the background.",
//     "promptMeta": {
//         "heroId": "ava_child",
//         "scenarioId": "home",
//         "symptomId": "stomach",
//         "severityId": "severe",
//         "mood": "comforting",
//         "cameraAngle": "soft-focus",
//         "colorPalette": "warm tones",
//         "lightingPreset": "soft indoor home daylight"
//     },
//     "prompt": "Two-person scene: the child and the helping adult described below must both be visible in the same frame. Do not show the child alone. Show the child hero 'AVA', a 6-year-old autistic girl, seated calmly and holding the stomach pain area gently. A kind nanny is clearly visible sitting beside the child at home, gently supporting her with a calm posture. The nanny looks caring and attentive, helping the child feel safe and relaxed. A simple home setting is visible with a sofa or bed and soft household items in the background. Severity: severe. Context: Home. Soft, non-vibrant cartoon style. Calm, safe, comforting. Minimal background. soft-focus. warm tones. soft indoor home daylight.",
//     "imageUrl": "https://v3b.fal.media/files/b/0a87f98a/HG7I9pru4aYCDkgqv4294_ee1a2c7e601c488a89a572edebea56d9.png"
// }

// {
//     "ok": true,
//     "step": "support_generate",
//     "supportKey": "ava_child__outside__stomach__severe",
//     "headerText": "You’re not alone. Help is coming.",
//     "sceneGuidance": "A helpful adult is clearly visible near the child outdoors, calmly calling for help on a phone while staying close to the child. The adult looks caring and protective. The child is seated safely on a bench or near a wall, holding her stomach gently. Outdoor setting cues like a park path or roadside are visible in the background.",
//     "promptMeta": {
//         "heroId": "ava_child",
//         "scenarioId": "outside",
//         "symptomId": "stomach",
//         "severityId": "severe",
//         "mood": "comforting",
//         "cameraAngle": "soft-focus",
//         "colorPalette": "warm tones",
//         "lightingPreset": "soft daylight outdoors"
//     },
//     "prompt": "Two-person scene: the child and the helping adult described below must both be visible in the same frame. Do not show the child alone. Show the child hero 'AVA', a 6-year-old autistic girl, seated calmly and holding the stomach pain area gently. A helpful adult is clearly visible near the child outdoors, calmly calling for help on a phone while staying close to the child. The adult looks caring and protective. The child is seated safely on a bench or near a wall, holding her stomach gently. Outdoor setting cues like a park path or roadside are visible in the background. Severity: severe. Context: Outside. Soft, non-vibrant cartoon style. Calm, safe, comforting. Minimal background. soft-focus. warm tones. soft daylight outdoors.",
//     "imageUrl": "https://v3b.fal.media/files/b/0a87f995/Q03dTmhY4mo_oBZj3QZfI_2d430f9f5e404da19e67a4c6e2f060d2.png"
// }

// AVA demo support images
// Same image reused for all symptoms (head / chest / stomach)
// Only scenario (place) matters

export const SUPPORT_IMAGE_MAP = {
  // ======================
  // AVA — SCHOOL (SEVERE)
  // ======================
  "ava_child__school__head__severe": "/support/ava_school_sympathy.png",
  "ava_child__school__stomach__severe": "/support/ava_school_sympathy.png",
  "ava_child__school__chest__severe": "/support/ava_school_sympathy.png",

  // ======================
  // AVA — HOME (SEVERE)
  // ======================
  "ava_child__home__head__severe": "/support/ava_home_sympathy.png",
  "ava_child__home__stomach__severe": "/support/ava_home_sympathy.png",
  "ava_child__home__chest__severe": "/support/ava_home_sympathy.png",

  // ======================
  // AVA — OUTSIDE (SEVERE)
  // ======================
  "ava_child__outside__head__severe": "/support/ava_outside_sympathy.png",
  "ava_child__outside__stomach__severe": "/support/ava_outside_sympathy.png",
  "ava_child__outside__chest__severe": "/support/ava_outside_sympathy.png",

  // ======================
  // LEO — SCHOOL (SEVERE)
  // ======================
  "leo_child__school__head__severe": "/support/leo_school_sympathy.png",
  "leo_child__school__stomach__severe": "/support/leo_school_sympathy.png",
  "leo_child__school__chest__severe": "/support/leo_school_sympathy.png",

  // ======================
  // LEO — HOME (SEVERE)
  // ======================
  "leo_child__home__head__severe": "/support/leo_home_sympathy.png",
  "leo_child__home__stomach__severe": "/support/leo_home_sympathy.png",
  "leo_child__home__chest__severe": "/support/leo_home_sympathy.png",

  // ======================
  // LEO — OUTSIDE (SEVERE)
  // ======================
  "leo_child__outside__head__severe": "/support/leo_outside_sympathy.png",
  "leo_child__outside__stomach__severe": "/support/leo_outside_sympathy.png",
  "leo_child__outside__chest__severe": "/support/leo_outside_sympathy.png",
};

// ///////////////////////leo///////////////
// {
//     "ok": true,
//     "step": "support_generate",
//     "supportKey": "leo_child__school__head__severe",
//     "headerText": "It’s okay, take a deep breath.",
//     "sceneGuidance": "A kind male school teacher is clearly visible sitting beside the child, gently supporting him with a calm and reassuring posture. The teacher is focused on helping the child feel safe. Classroom desks and books are visible in the background.",
//     "promptMeta": {
//         "heroId": "leo_child",
//         "scenarioId": "school",
//         "symptomId": "head",
//         "severityId": "severe",
//         "mood": "comforting",
//         "cameraAngle": "soft-focus",
//         "colorPalette": "warm tones",
//         "lightingPreset": "soft indoor classroom daylight"
//     },
//     "prompt": "Two-person scene: the child and the helping adult described below must both be visible in the same frame. Do not show the child alone. Show the child hero 'LEO', a 6-year-old autistic boy, seated calmly and holding the head pain area gently. A kind male school teacher is clearly visible sitting beside the child, gently supporting him with a calm and reassuring posture. The teacher is focused on helping the child feel safe. Classroom desks and books are visible in the background. Severity: severe. Context: School. Soft, non-vibrant cartoon style. Calm, safe, comforting. Minimal background. soft-focus. warm tones. soft indoor classroom daylight.",
//     "imageUrl": "https://v3b.fal.media/files/b/0a87f9ae/4YHBVXOBDaJ40qWN4mlHh_300bfd38f840414fad5ddac7ceb44bec.png"
// }

// {
//     "ok": true,
//     "step": "support_generate",
//     "supportKey": "leo_child__home__stomach__severe",
//     "headerText": "You’re safe at home.",
//     "sceneGuidance": "A caring parent or home guardian is clearly visible sitting beside the child at home, gently comforting him with a calm presence. The helper looks attentive and reassuring. A simple home setting with a bed or sofa is visible in the background.",
//     "promptMeta": {
//         "heroId": "leo_child",
//         "scenarioId": "home",
//         "symptomId": "stomach",
//         "severityId": "severe",
//         "mood": "comforting",
//         "cameraAngle": "soft-focus",
//         "colorPalette": "warm tones",
//         "lightingPreset": "soft indoor home daylight"
//     },
//     "prompt": "Two-person scene: the child and the helping adult described below must both be visible in the same frame. Do not show the child alone. Show the child hero 'LEO', a 6-year-old autistic boy, seated calmly and holding the stomach pain area gently. A caring parent or home guardian is clearly visible sitting beside the child at home, gently comforting him with a calm presence. The helper looks attentive and reassuring. A simple home setting with a bed or sofa is visible in the background. Severity: severe. Context: Home. Soft, non-vibrant cartoon style. Calm, safe, comforting. Minimal background. soft-focus. warm tones. soft indoor home daylight.",
//     "imageUrl": "https://v3b.fal.media/files/b/0a87f9b7/wjAkI6YesOcHvH7MFMxzD_4843b4f0297c4dda9ca7bf66fe2119a9.png"
// }

// {
//     "ok": true,
//     "step": "support_generate",
//     "supportKey": "leo_child__outside__chest__severe",
//     "headerText": "Help is coming.",
//     "sceneGuidance": "A helpful adult is clearly visible standing close to the child outdoors, calmly calling for help on a phone while staying near him. The adult appears protective and attentive. The child is seated safely, holding his chest gently. Outdoor surroundings such as a sidewalk or park area are visible.",
//     "promptMeta": {
//         "heroId": "leo_child",
//         "scenarioId": "outside",
//         "symptomId": "chest",
//         "severityId": "severe",
//         "mood": "comforting",
//         "cameraAngle": "soft-focus",
//         "colorPalette": "warm tones",
//         "lightingPreset": "soft daylight outdoors"
//     },
//     "prompt": "Two-person scene: the child and the helping adult described below must both be visible in the same frame. Do not show the child alone. Show the child hero 'LEO', a 6-year-old autistic boy, seated calmly and holding the chest discomfort area gently. A helpful adult is clearly visible standing close to the child outdoors, calmly calling for help on a phone while staying near him. The adult appears protective and attentive. The child is seated safely, holding his chest gently. Outdoor surroundings such as a sidewalk or park area are visible. Severity: severe. Context: Outside. Soft, non-vibrant cartoon style. Calm, safe, comforting. Minimal background. soft-focus. warm tones. soft daylight outdoors.",
//     "imageUrl": "https://v3b.fal.media/files/b/0a87f9cd/WIKH2qqzN_2TNcUbdAJ--_c820c2ef227f4a669d3f2dc7479cb038.png"
// }

// src/app/data/supportImageMap.js
// export const SUPPORT_IMAGE_MAP = {
//   // =====================
//   // LEO (5)
//   // =====================
//   "leo_child__home__head_severe": "",
//   "leo_child__home__stomach_severe": "",
//   "leo_child__school__head_severe": "",
//   "leo_child__school__chest_severe": "",
//   "leo_child__outside__stomach-severe": "",

//   // =====================
//   // AVA (5)
//   // =====================
//   "ava_child__home__head_severe": "",
//   "ava_child__home__chest_severe": "",
//   "ava_child__school__stomach_severe": "",
//   "ava_child__school__head_severe": "",
//   "ava_child__outside__chest_severe": "",
// };

const CAMERA_PRESETS = {
  soft_focus: {
    depth_of_field: "medium",
    focus: "soft focus on subject",
  },
  sharp_focus: {
    depth_of_field: "shallow",
    focus: "sharp focus on subject, background blurred",
  },
  portrait_focus: {
    depth_of_field: "shallow",
    focus: "face and hands sharp, background very soft",
  },
};

const ANGLE_PRESETS = {
  eye_level: "eye-level, centered framing",
  slightly_high: "slightly high angle, comforting perspective",
  close_up: "close-up portrait framing, gentle crop",
};

const PALETTES = {
  pastel_blue: "soft pastel blues, muted beige accents, low saturation",
  warm_beige: "warm beige and soft peach tones, low saturation",
  mint_soft: "soft mint and pale gray palette, calm clinical feel",
};

const LIGHTING = {
  mild_daylight: { conditions: "soft mild daylight", shadows: "very soft" },
  warm_lamp: { conditions: "warm indoor lamp light", shadows: "soft" },
  cloudy_soft: { conditions: "diffused cloudy daylight", shadows: "low contrast" },
};

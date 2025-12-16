// src/models/episodeModel.js

// Simple helper to create a consistent episode object
export function createEpisode(state, summaryText, imageUrl) {
  const now = new Date();

  return {
    id: Date.now().toString(), // good enough for hackathon
    createdAt: now.toISOString(),

    // raw state from frontend (hero, scenario, body area, etc.)
    state,

    // what we show to parent/doctor
    summaryText,
    imageUrl
  };
}

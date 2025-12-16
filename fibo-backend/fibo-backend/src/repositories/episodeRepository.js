// src/repositories/episodeRepository.js

const EPISODES = [];

/**
 * Save a new episode in memory.
 */
export function saveEpisode(episode) {
  EPISODES.push(episode);
  return episode;
}

/**
 * Get all episodes (later you can filter by child, etc.)
 */
export function listEpisodes() {
  return [...EPISODES];
}

/**
 * Find one episode by id.
 */
export function findEpisodeById(id) {
  return EPISODES.find((e) => e.id === id) || null;
}

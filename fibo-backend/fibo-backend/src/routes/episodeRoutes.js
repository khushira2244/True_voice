// src/routes/episodeRoutes.js
import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";




const router = Router();

const episodes = [];
let nextEpisodeId = 1;

export function createEpisode({ userId, hero, scenario, symptom, severity, prompt, imageUrl }) {
  const episode = {
    id: nextEpisodeId++,
    userId,
    hero,
    scenario,
    symptom,
    severity,
    prompt,
    imageUrl,
    createdAt: new Date().toISOString()
  };

  episodes.push(episode);
  return episode;
}

// GET /api/episodes  -> get all episodes for THIS logged-in user
router.get("/", requireAuth, (req, res) => {
  const userId = req.user.id;         
  const myEpisodes = episodes.filter(e => e.userId === userId);

  return res.json({ episodes: myEpisodes });
});

// GET /api/episodes/last -> last episode for THIS logged-in user
router.get("/last", requireAuth, (req, res) => {
  const userId = req.user.id;
  const myEpisodes = episodes.filter(e => e.userId === userId);

  const lastEpisode = myEpisodes.length
    ? myEpisodes[myEpisodes.length - 1]
    : null;

  return res.json({ lastEpisode });
});

export default router;

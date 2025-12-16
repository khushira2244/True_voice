import { Router } from "express";
import { getCurrentWeatherText } from "../services/weatherService.js";
import { config } from "../config/env.js";

const router = Router();

router.get("/weather", async (req, res) => {
  try {
    const weatherText = await getCurrentWeatherText({
      lat: config.WEATHER_LAT,
      lon: config.WEATHER_LON,
    });

    res.json({
      ok: true,
      weatherText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "Failed to fetch weather",
    });
  }
});

export default router;

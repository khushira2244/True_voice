// src/routes/locationRoutes.js
import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

// POST /api/location/reverse
router.post("/location/reverse", requireAuth, async (req, res) => {
  const { lat, lon } = req.body || {};
  if (typeof lat !== "number" || typeof lon !== "number") {
    return badRequest(res, "lat and lon must be numbers");
  }

  try {
    // Nominatim reverse geocode
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
      `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

    const r = await fetch(url, {
      headers: {
        // important for Nominatim
        "User-Agent": "true-voice-hackathon-demo/1.0",
      },
    });

    if (!r.ok) {
      return res.status(200).json({
        ok: true,
        placeLabel: null,
        note: "Reverse geocode failed, continue with lat/lon only.",
      });
    }

    const data = await r.json();
    const label =
      data?.name ||
      data?.address?.neighbourhood ||
      data?.address?.suburb ||
      data?.address?.road ||
      data?.display_name ||
      null;

    return res.json({ ok: true, placeLabel: label });
  } catch (e) {
    return res.status(200).json({
      ok: true,
      placeLabel: null,
      note: "Reverse geocode unavailable, continue with lat/lon only.",
    });
  }
});

export default router;

// src/routes/index.js
import { Router } from "express";
import promptRoutes from "./promptRoutes.js";
import episodeRoutes from "./episodeRoutes.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "Api is live " });
});

// episodes → /api/episodes/...
router.use("/episodes", episodeRoutes);
router.use("/", promptRoutes);

export default router;

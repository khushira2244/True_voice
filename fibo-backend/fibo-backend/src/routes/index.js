// src/routes/index.js
import { Router } from "express";
import promptRoutes from "./promptRoutes.js";
import episodeRoutes from "./episodeRoutes.js";
import locationRoutes from "./locationRoutes.js";
import sosRoutes from "./sosRoutes.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "Api is live " });
});

// episodes → /api/episodes/...
router.use("/episodes", episodeRoutes);
router.use("/", promptRoutes);



router.use("/", locationRoutes);


router.use("/", sosRoutes);


export default router;


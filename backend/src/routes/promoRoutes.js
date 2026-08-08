import { Router } from "express";
import { promoController } from "../controllers/promoController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/validate", requireAuth, promoController.validate);

export default router;

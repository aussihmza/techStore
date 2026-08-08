import { Router } from "express";
import { returnController } from "../controllers/returnController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", returnController.listMine);
router.post("/", returnController.create);

export default router;

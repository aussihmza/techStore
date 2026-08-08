import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);

export default router;

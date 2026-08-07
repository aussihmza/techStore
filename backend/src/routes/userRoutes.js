import { Router } from "express";
import { userController } from "../controllers/userController.js";

const router = Router();

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);

export default router;

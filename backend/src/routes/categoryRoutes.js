import { Router } from "express";
import { categoryController } from "../controllers/categoryController.js";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:slug", categoryController.getBySlug);
router.post("/", categoryController.create);

export default router;

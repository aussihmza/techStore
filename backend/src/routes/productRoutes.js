import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { reviewController } from "../controllers/reviewController.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", productController.getAll);
router.get("/:id/reviews", optionalAuth, reviewController.list);
router.post("/:id/reviews", requireAuth, reviewController.create);
router.put("/:id/reviews/me", requireAuth, reviewController.updateMine);
router.delete("/:id/reviews/me", requireAuth, reviewController.deleteMine);
router.get("/:id", productController.getById);
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);

export default router;

import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { reviewController } from "../controllers/reviewController.js";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";

const router = Router();

router.get("/", productController.getAll);
router.get("/:id/reviews", optionalAuth, reviewController.list);
router.post("/:id/reviews", requireAuth, reviewController.create);
router.put("/:id/reviews/me", requireAuth, reviewController.updateMine);
router.delete("/:id/reviews/me", requireAuth, reviewController.deleteMine);
router.get("/:id", productController.getById);
// Product writes live under /api/admin/products (admin only).

export default router;

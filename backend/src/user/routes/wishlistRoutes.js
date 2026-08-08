import { Router } from "express";
import { wishlistController } from "../controllers/wishlistController.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", wishlistController.getWishlist);
router.post("/items", wishlistController.addItem);
router.post("/toggle", wishlistController.toggleItem);
router.delete("/items/:id", wishlistController.removeItem);

export default router;

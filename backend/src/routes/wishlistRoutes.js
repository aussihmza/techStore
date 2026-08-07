import { Router } from "express";
import { wishlistController } from "../controllers/wishlistController.js";

const router = Router();

router.get("/", wishlistController.getWishlist);
router.post("/items", wishlistController.addItem);
router.delete("/items/:id", wishlistController.removeItem);

export default router;

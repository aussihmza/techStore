import { Router } from "express";
import { cartController } from "../controllers/cartController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", cartController.getCart);
router.delete("/", cartController.clearCart);
router.post("/items", cartController.addItem);
router.put("/items/:id", cartController.updateItem);
router.delete("/items/:id", cartController.removeItem);

export default router;

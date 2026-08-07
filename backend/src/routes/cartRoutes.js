import { Router } from "express";
import { cartController } from "../controllers/cartController.js";

const router = Router();

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.put("/items/:id", cartController.updateItem);
router.delete("/items/:id", cartController.removeItem);

export default router;

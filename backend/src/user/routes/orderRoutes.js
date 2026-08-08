import { Router } from "express";
import { orderController } from "../controllers/orderController.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", orderController.getAll);
router.get("/:id", orderController.getById);
router.post("/", orderController.create);

export default router;

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "./middleware/requireAdmin.js";
import { adminDashboardController } from "./controllers/dashboardController.js";
import { adminProductController } from "./controllers/productController.js";
import { adminOrderController } from "./controllers/orderController.js";
import { adminReviewController } from "./controllers/reviewController.js";
import { adminReturnController } from "./controllers/returnController.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", adminDashboardController.getStats);

router.get("/products", adminProductController.list);
router.post("/products", adminProductController.create);
router.put("/products/:id", adminProductController.update);
router.delete("/products/:id", adminProductController.remove);

router.get("/orders", adminOrderController.list);
router.patch("/orders/:orderId", adminOrderController.updateStatus);
router.delete("/orders/:orderId", adminOrderController.remove);

router.get("/reviews", adminReviewController.list);
router.delete("/reviews/:id", adminReviewController.remove);

router.get("/returns", adminReturnController.list);
router.patch("/returns/:id", adminReturnController.updateStatus);

export default router;

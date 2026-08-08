import { Router } from "express";
import { paymentController } from "../controllers/paymentController.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

router.post(
  "/create-checkout-session",
  requireAuth,
  paymentController.createCheckoutSession
);
router.post(
  "/complete-checkout",
  requireAuth,
  paymentController.completeCheckoutSession
);

export default router;

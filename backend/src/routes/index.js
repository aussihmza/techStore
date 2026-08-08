import { Router } from "express";
import userRoutes from "../user/routes.js";
import adminRoutes from "../admin/routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

router.use(userRoutes);
router.use("/admin", adminRoutes);

export default router;

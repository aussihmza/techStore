import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";
import contactRoutes from "./contactRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/contact", contactRoutes);

export default router;

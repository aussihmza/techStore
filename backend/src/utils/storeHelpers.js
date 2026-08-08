import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";
import { Wishlist } from "../models/Wishlist.js";
import { ApiError } from "./ApiError.js";

export const TAX_RATE = 0.08;

export function normalizeVariantToken(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

export function buildLineId(productSlug, colorName = "", storage = "") {
  const color = normalizeVariantToken(colorName) || "default";
  const storageToken = normalizeVariantToken(storage) || "default";
  return `${productSlug}__${color}__${storageToken}`;
}

export function resolveProductVariants(product, _colorName, storageOption) {
  // Color options intentionally disabled for the catalog
  const selectedColor = null;
  const storageOptions = Array.isArray(product.storageOptions)
    ? product.storageOptions
    : [];

  let selectedStorage = null;
  if (storageOptions.length > 0) {
    if (storageOption) {
      selectedStorage = storageOptions.find(
        (option) =>
          String(option).toLowerCase() ===
          String(storageOption).trim().toLowerCase(),
      );
      if (!selectedStorage) {
        throw new ApiError(
          400,
          "Selected storage/size is not available for this product.",
        );
      }
    } else {
      selectedStorage = storageOptions[0];
    }
  }

  return { selectedColor, selectedStorage };
}

export function productToLineItem(product, qty = 1, variants = {}) {
  const { selectedColor = null, selectedStorage = null } = variants;
  const lineId = buildLineId(
    product.slug,
    selectedColor?.name,
    selectedStorage,
  );

  return {
    lineId,
    productSlug: product.slug,
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    badge: product.badge,
    qty,
    selectedColor: selectedColor
      ? { name: selectedColor.name, hex: selectedColor.hex }
      : null,
    selectedStorage: selectedStorage || null,
  };
}

export function productToWishlistItem(product) {
  const { qty: _qty, lineId: _lineId, selectedColor: _c, selectedStorage: _s, ...item } =
    productToLineItem(product, 1);
  return item;
}

export function getItemLineId(item) {
  if (item.lineId) return item.lineId;
  return buildLineId(
    item.productSlug,
    item.selectedColor?.name,
    item.selectedStorage,
  );
}

export function formatVariantLabel(item) {
  const parts = [];
  if (item.selectedColor?.name) parts.push(item.selectedColor.name);
  if (item.selectedStorage) parts.push(item.selectedStorage);
  return parts.join(" · ");
}

export function toCartItemResponse(item) {
  const lineId = getItemLineId(item);
  return {
    id: lineId,
    lineId,
    productSlug: item.productSlug,
    name: item.name,
    category: item.category,
    brand: item.brand,
    price: item.price,
    rating: item.rating,
    reviews: item.reviews,
    image: item.image,
    badge: item.badge,
    qty: item.qty,
    selectedColor: item.selectedColor || null,
    selectedStorage: item.selectedStorage || null,
    variantLabel: formatVariantLabel(item),
  };
}

export function toWishlistItemResponse(item) {
  return {
    id: item.productSlug,
    productSlug: item.productSlug,
    name: item.name,
    category: item.category,
    brand: item.brand,
    price: item.price,
    rating: item.rating,
    reviews: item.reviews,
    image: item.image,
    badge: item.badge,
  };
}

/** Derive shipment status from placedAt using the same 3–5 day delivery window. */
export function deriveFulfillmentStatus(placedAt) {
  const placed = new Date(placedAt).getTime();
  if (Number.isNaN(placed)) {
    return { status: "processing", statusLabel: "Processing" };
  }

  const hours = (Date.now() - placed) / (1000 * 60 * 60);

  if (hours < 24) {
    return { status: "processing", statusLabel: "Processing" };
  }
  if (hours < 72) {
    return { status: "shipped", statusLabel: "In transit" };
  }
  if (hours < 120) {
    return { status: "out_for_delivery", statusLabel: "Out for delivery" };
  }
  return { status: "delivered", statusLabel: "Delivered" };
}

export function toOrderResponse(order) {
  const doc = typeof order.toObject === "function" ? order.toObject() : order;
  const fulfillment = deriveFulfillmentStatus(doc.placedAt);

  return {
    id: doc.orderId,
    orderId: doc.orderId,
    items: doc.items.map(toCartItemResponse),
    subtotal: doc.subtotal,
    discount: doc.discount || 0,
    promoCode: doc.promoCode || null,
    taxes: doc.taxes,
    total: doc.total,
    shipping: doc.shipping,
    deliveryFrom: doc.deliveryFrom,
    deliveryTo: doc.deliveryTo,
    placedAt: doc.placedAt,
    paymentStatus: doc.paymentStatus,
    paymentMethod: doc.paymentMethod,
    stripeSessionId: doc.stripeSessionId,
    status: fulfillment.status,
    statusLabel: fulfillment.statusLabel,
  };
}

export function calcCartTotals(subtotal, discount = 0) {
  const safeSubtotal = Math.round(Math.max(0, Number(subtotal) || 0) * 100) / 100;
  const safeDiscount = Math.min(
    safeSubtotal,
    Math.round(Math.max(0, Number(discount) || 0) * 100) / 100
  );
  const taxable = Math.round((safeSubtotal - safeDiscount) * 100) / 100;
  const taxes = Math.round(taxable * TAX_RATE * 100) / 100;
  const total = Math.round((taxable + taxes) * 100) / 100;
  return {
    subtotal: safeSubtotal,
    discount: safeDiscount,
    taxes,
    total,
  };
}

export function generateOrderId() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `#TS-${num}`;
}

export function getEstimatedDelivery() {
  const from = new Date();
  from.setDate(from.getDate() + 3);
  const to = new Date();
  to.setDate(to.getDate() + 5);

  const fmt = (d) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

  return { from: fmt(from), to: fmt(to) };
}

export async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

export async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
}

export async function findProductBySlugOrId(idOrSlug) {
  if (!idOrSlug) return null;

  const product = await Product.findOne({ slug: idOrSlug });
  if (product) return product;

  if (/^[a-f\d]{24}$/i.test(idOrSlug)) {
    return Product.findById(idOrSlug);
  }

  return null;
}

export function requireShipping(shipping = {}) {
  const required = ["firstName", "lastName", "email", "address", "city", "state", "zip"];
  for (const key of required) {
    if (!String(shipping[key] || "").trim()) {
      throw new ApiError(400, `shipping.${key} is required`);
    }
  }

  return {
    firstName: String(shipping.firstName).trim(),
    lastName: String(shipping.lastName).trim(),
    email: String(shipping.email).trim().toLowerCase(),
    address: String(shipping.address).trim(),
    city: String(shipping.city).trim(),
    state: String(shipping.state).trim(),
    zip: String(shipping.zip).trim(),
  };
}

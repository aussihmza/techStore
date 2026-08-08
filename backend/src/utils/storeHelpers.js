import { Product } from "../models/Product.js";
import { Cart } from "../models/Cart.js";
import { Wishlist } from "../models/Wishlist.js";
import { ApiError } from "./ApiError.js";

export const TAX_RATE = 0.08;

export function productToLineItem(product, qty = 1) {
  return {
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
  };
}

export function productToWishlistItem(product) {
  const { qty: _qty, ...item } = productToLineItem(product, 1);
  return item;
}

export function toCartItemResponse(item) {
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
    qty: item.qty,
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

export function toOrderResponse(order) {
  const doc = typeof order.toObject === "function" ? order.toObject() : order;

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

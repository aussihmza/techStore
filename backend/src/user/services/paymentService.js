import { ApiError } from "../../utils/ApiError.js";
import { assertStripe } from "../../config/stripe.js";
import { env } from "../../config/env.js";
import { orderService } from "./orderService.js";
import {
  calcCartTotals,
  getOrCreateCart,
  requireShipping,
} from "../../utils/storeHelpers.js";
import {
  calcPromoDiscount,
  getPromoDefinition,
  normalizePromoCode,
} from "../../config/promos.js";

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

function getStripe() {
  try {
    return assertStripe();
  } catch {
    throw new ApiError(
      500,
      "Stripe is not configured. Add STRIPE_SECRET_KEY in backend/.env"
    );
  }
}

function resolvePromo(subtotal, promoCode) {
  const normalized = normalizePromoCode(promoCode || "");
  if (!normalized) return { promoCode: null, discount: 0 };

  const promo = getPromoDefinition(normalized);
  if (!promo) {
    throw new ApiError(400, "Invalid promo code.");
  }

  return {
    promoCode: promo.code,
    discount: calcPromoDiscount(subtotal, promo),
  };
}

export const paymentService = {
  async createCheckoutSession(userId, shipping, promoCode) {
    const stripe = getStripe();
    const cart = await getOrCreateCart(userId);

    if (!cart.items.length) {
      throw new ApiError(400, "Cart is empty");
    }

    const validatedShipping = requireShipping(shipping);
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const promo = resolvePromo(subtotal, promoCode);
    const totals = calcCartTotals(subtotal, promo.discount);
    const amount = toCents(totals.total);

    if (amount < 50) {
      throw new ApiError(400, "Order total is too small for Stripe payment");
    }

    const frontendUrl = env.corsOrigin.replace(/\/$/, "");
    const sessionPayload = {
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: validatedShipping.email,
      line_items: [
        ...cart.items.map((item) => {
          const variantBits = [
            item.selectedColor?.name,
            item.selectedStorage,
          ].filter(Boolean);
          const name = variantBits.length
            ? `${item.name} (${variantBits.join(" / ")})`
            : item.name;

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name,
                images: item.image?.startsWith("http")
                  ? [item.image]
                  : undefined,
              },
              unit_amount: toCents(item.price),
            },
            quantity: item.qty,
          };
        }),
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Tax (8%)" },
            unit_amount: toCents(totals.taxes),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: String(userId),
        shipping: JSON.stringify(validatedShipping),
        expectedTotal: String(totals.total),
        promoCode: promo.promoCode || "",
        discount: String(totals.discount || 0),
      },
      success_url: `${frontendUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout?checkout=cancel`,
    };

    if (totals.discount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: toCents(totals.discount),
        currency: "usd",
        duration: "once",
        name: promo.promoCode || "Promo",
      });
      sessionPayload.discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);

    return {
      url: session.url,
      sessionId: session.id,
    };
  },

  async completeCheckoutSession(userId, sessionId) {
    if (!sessionId) {
      throw new ApiError(400, "sessionId is required");
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new ApiError(402, "Payment has not been completed");
    }

    if (session.metadata?.userId !== String(userId)) {
      throw new ApiError(403, "Checkout session does not belong to this user");
    }

    let shipping;
    try {
      shipping = JSON.parse(session.metadata.shipping || "{}");
    } catch {
      throw new ApiError(400, "Invalid shipping data on checkout session");
    }

    const result = await orderService.createFromPaidCheckout(
      userId,
      shipping,
      session.id,
      session.metadata?.promoCode || null
    );

    return {
      order: result.order,
      alreadyCompleted: result.alreadyCompleted,
    };
  },
};

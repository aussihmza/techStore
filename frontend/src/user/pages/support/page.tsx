import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import type { PlacedOrder } from "@/types/order";
import { formatPrice } from "@/user/lib/cart";
import { formatShippingAddress, orderPathId } from "@/user/lib/order";
import OrderStatusBadge from "@/user/components/orders/OrderStatusBadge";
import OrderTimeline from "@/user/components/orders/OrderTimeline";
import ReturnRequestForm from "@/user/components/support/ReturnRequestForm";
import { ShieldIcon, TruckIcon } from "@/user/components/ui/icons";

const sections = [
  { id: "shipping-info", title: "Shipping Info" },
  { id: "returns-warranty", title: "Returns & Warranty" },
  { id: "order-tracking", title: "Order Tracking" },
];

export default function SupportPage() {
  const { findOrder, isLoggedIn, openLoginPrompt } = useStore();
  const [orderQuery, setOrderQuery] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [tracked, setTracked] = useState<PlacedOrder | null>(null);

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    const q = orderQuery.trim();
    if (!q) {
      setLookupError("Enter your order ID to track your shipment.");
      setTracked(null);
      return;
    }

    if (!isLoggedIn) {
      openLoginPrompt();
      setLookupError("Please log in to track your orders.");
      setTracked(null);
      return;
    }

    const match = await findOrder(q);
    if (match) {
      setTracked(match);
      setLookupError("");
      return;
    }

    setTracked(null);
    setLookupError(
      "We couldn’t find that order on your account. Check the confirmation screen for the exact ID.",
    );
  };

  return (
    <div className="w-full bg-white">
      <div className="page-shell pb-20 pt-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Customer Service</p>
          <h1 className="section-heading mt-2 text-3xl sm:text-4xl">
            Shipping, Returns & Tracking
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Delivery options, return and warranty coverage, and tools to track your TechStore order.
          </p>

          <nav
            aria-label="Support sections"
            className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:text-brand"
              >
                {section.title}
              </a>
            ))}
          </nav>

          {/* Shipping Info */}
          <section id="shipping-info" className="scroll-mt-24 mt-14">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <TruckIcon className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">Shipping Info</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">How TechStore delivers your order</p>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-ink">Standard shipping (free)</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  Every eligible order includes free standard shipping. Most orders ship within 1–2
                  business days after payment is confirmed (card) or after COD order placement.
                  Estimated delivery is typically <strong className="font-semibold text-ink">3–5 business days</strong>{" "}
                  and appears on your checkout confirmation and order details.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">Processing & cut-off</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  Orders placed on weekdays before 2:00 PM local warehouse time usually begin
                  processing the same day. Weekend and holiday orders start the next business day.
                  You will see status updates move from Processing → In transit → Out for delivery →
                  Delivered in{" "}
                  <Link to="/orders" className="font-medium text-brand hover:underline">
                    My Orders
                  </Link>
                  .
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">Delivery areas</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  We currently deliver to addresses that can be entered at checkout (city, state, and
                  ZIP). If a carrier cannot reach your location, support will contact you with
                  alternate options before canceling the shipment.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">Cash on Delivery vs card</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  COD and card orders use the same shipping window. Card payments are confirmed
                  before fulfillment; COD orders are prepared after placement and paid on delivery.
                  Shipping itself remains free on both methods.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">Delays & help</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  Weather, carrier volume, or address issues can add a short delay. If tracking has
                  not updated for 48 hours after the ship date,{" "}
                  <Link to="/contact" className="font-medium text-brand hover:underline">
                    contact support
                  </Link>{" "}
                  with your order ID and we will investigate with the carrier.
                </p>
              </div>
            </div>
          </section>

          {/* Returns & Warranty */}
          <section id="returns-warranty" className="scroll-mt-24 mt-16 border-t border-slate-100 pt-14">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <ShieldIcon className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">Returns & Warranty</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">Last updated: July 22, 2026</p>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-ink">30-day returns</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  Most new products can be returned within 30 days of delivery if they are unused,
                  in original packaging, and include all accessories. Opened software, personalized
                  items, and clearance goods marked final sale are not eligible.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">How to start a return</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  Use the in-app RMA form below with your order and reason. When approved, we’ll
                  email next steps (and a prepaid label when eligible). Pack the item securely,
                  drop it off with the carrier, and refunds go to your original payment method within
                  5–10 business days after inspection.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">Manufacturer warranty</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  TechStore products include at least a 1-year limited manufacturer warranty covering
                  defects in materials and workmanship under normal use. Accidental damage, liquid
                  exposure, unauthorized repairs, and wear-and-tear are typically not covered.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">Warranty claims</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  Choose <strong className="font-semibold text-ink">Warranty claim</strong> in the
                  form below and include the product serial number in the details. We’ll guide you
                  through repair, replacement, or manufacturer RMA options.
                </p>
              </div>

              <ReturnRequestForm />
            </div>
          </section>

          {/* Order Tracking */}
          <section id="order-tracking" className="scroll-mt-24 mt-16 border-t border-slate-100 pt-14">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <TruckIcon className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">Order Tracking</h2>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Enter the order ID from your confirmation email (example: #TS-12345).
            </p>

            <form onSubmit={handleTrack} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => {
                  setOrderQuery(e.target.value);
                  setLookupError("");
                  setTracked(null);
                }}
                placeholder="#TS-12345"
                aria-label="Order ID"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
              <button
                type="submit"
                className="rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Track order
              </button>
            </form>

            {lookupError && (
              <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {lookupError}
              </p>
            )}

            {tracked && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Order
                    </p>
                    <p className="mt-1 text-xl font-bold text-ink">{tracked.id}</p>
                  </div>
                  <OrderStatusBadge
                    status={tracked.status}
                    statusLabel={tracked.statusLabel}
                    placedAt={tracked.placedAt}
                  />
                </div>

                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Estimated delivery
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-ink">
                      {tracked.deliveryFrom} – {tracked.deliveryTo}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Ship to
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-ink">
                      {formatShippingAddress(tracked.shipping)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Items
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-ink">
                      {tracked.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-ink">
                      {formatPrice(tracked.total)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 border-t border-slate-200 pt-5">
                  <OrderTimeline order={tracked} />
                  <Link
                    to={`/orders/${orderPathId(tracked.id)}`}
                    className="mt-5 inline-flex text-sm font-semibold text-brand hover:underline"
                  >
                    Open full order details
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-10 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-ink">Tracking timeline</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  After checkout you’ll receive a confirmation email with your order ID. Once the
                  package ships (usually within 1–2 business days), carrier updates appear here and
                  in follow-up emails until delivery.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">Delivery windows</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  Standard shipping typically arrives in 3–5 business days. You’ll see an estimated
                  window on your order confirmation. Delays from weather or carrier volume may push
                  delivery slightly later — we’ll notify you if that happens.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">Need help?</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">
                  If tracking hasn’t updated for 48 hours after the ship date,{" "}
                  <Link to="/contact" className="font-medium text-brand hover:underline">
                    contact our support team
                  </Link>{" "}
                  with your order ID and we’ll investigate with the carrier.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import type { PlacedOrder } from "@/types/order";
import { formatShippingAddress } from "@/lib/order";
import { ClockIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";

const sections = [
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
      <div className="w-full px-4 pb-20 pt-10 sm:px-6 lg:px-10 xl:px-14">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Customer Service</p>
          <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
            Returns, Warranty & Tracking
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Everything you need to return a product, claim warranty coverage, or track your TechStore
            order.
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

          {/* Returns & Warranty */}
          <section id="returns-warranty" className="scroll-mt-24 mt-14">
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
                  Contact support with your order ID and reason for return. We’ll email a prepaid
                  label when eligible. Pack the item securely, drop it off with the carrier, and
                  refunds are issued to your original payment method within 5–10 business days after
                  inspection.
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
                  Email{" "}
                  <a href="mailto:support@techstore.com" className="font-medium text-brand hover:underline">
                    support@techstore.com
                  </a>{" "}
                  with your order ID, product serial number, and a short description of the issue.
                  We’ll guide you through repair, replacement, or manufacturer RMA options.
                </p>
              </div>
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <ClockIcon className="h-3.5 w-3.5" />
                    In transit
                  </span>
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
                      $
                      {tracked.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </dd>
                  </div>
                </dl>
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

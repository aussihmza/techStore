import type { FulfillmentStatus, PlacedOrder } from "@/types/order";
import { getOrderStatus } from "@/lib/order";

const STEPS: { key: FulfillmentStatus; label: string }[] = [
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_INDEX: Record<FulfillmentStatus, number> = {
  processing: 0,
  shipped: 1,
  out_for_delivery: 2,
  delivered: 3,
};

export default function OrderTimeline({ order }: { order: PlacedOrder }) {
  const { status } = getOrderStatus(order);
  const current = STATUS_INDEX[status];

  return (
    <ol className="space-y-3">
      {STEPS.map((step, index) => {
        const done = index <= current;
        const active = index === current;
        return (
          <li key={step.key} className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? "bg-brand text-white"
                  : "border border-slate-200 bg-white text-slate-400"
              }`}
            >
              {done ? "✓" : index + 1}
            </span>
            <div>
              <p
                className={`text-sm font-semibold ${
                  active ? "text-brand" : done ? "text-ink" : "text-slate-400"
                }`}
              >
                {step.label}
              </p>
              {active ? (
                <p className="text-xs text-slate-500">Current status</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

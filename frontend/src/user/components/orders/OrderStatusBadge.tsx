import type { FulfillmentStatus } from "@/types/order";
import { getOrderStatus } from "@/user/lib/order";
import { ClockIcon } from "@/user/components/ui/icons";

const styles: Record<FulfillmentStatus, string> = {
  processing: "bg-amber-100 text-amber-800",
  shipped: "bg-sky-100 text-sky-800",
  out_for_delivery: "bg-violet-100 text-violet-800",
  delivered: "bg-emerald-100 text-emerald-800",
};

interface OrderStatusBadgeProps {
  status?: FulfillmentStatus;
  statusLabel?: string;
  placedAt?: string;
}

export default function OrderStatusBadge({
  status,
  statusLabel,
  placedAt,
}: OrderStatusBadgeProps) {
  const resolved = getOrderStatus({ status, statusLabel, placedAt });

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles[resolved.status]}`}
    >
      <ClockIcon className="h-3.5 w-3.5" />
      {resolved.statusLabel}
    </span>
  );
}

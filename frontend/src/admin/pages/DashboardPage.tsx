import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminStatsApi,
  type AdminProductOrderStat,
  type AdminRecentOrder,
  type AdminStats,
} from "@/admin/api/admin";
import ProductOrdersPieChart from "@/admin/components/ProductOrdersPieChart";
import { ApiError } from "@/lib/api/client";

const cardStyles = [
  { accent: "from-sky-500 to-blue-600", ring: "hover:border-sky-300" },
  { accent: "from-emerald-500 to-teal-600", ring: "hover:border-emerald-300" },
  { accent: "from-amber-500 to-orange-500", ring: "hover:border-amber-300" },
  { accent: "from-rose-500 to-red-500", ring: "hover:border-rose-300" },
  { accent: "from-slate-600 to-slate-800", ring: "hover:border-slate-400" },
];

function paymentTone(status: string) {
  const value = status.toLowerCase();
  if (value === "paid") return "bg-emerald-50 text-emerald-700";
  if (value === "failed") return "bg-rose-50 text-rose-700";
  if (value === "refunded") return "bg-slate-100 text-slate-600";
  return "bg-amber-50 text-amber-800";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<AdminRecentOrder[]>([]);
  const [productOrders, setProductOrders] = useState<AdminProductOrderStat[]>(
    [],
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const data = await getAdminStatsApi();
        if (!active) return;
        setStats(data.stats);
        setRecent(data.recentOrders);
        setProductOrders(data.topProductsByOrders || []);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof ApiError ? err.message : "Could not load dashboard.",
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (error) return <p className="text-rose-600">{error}</p>;
  if (!stats) return null;

  const cards = [
    { label: "Products", value: stats.products, to: "/admin/products" },
    { label: "Orders", value: stats.orders, to: "/admin/orders" },
    { label: "Reviews", value: stats.reviews, to: "/admin/reviews" },
    {
      label: "Pending returns",
      value: stats.pendingReturns,
      to: "/admin/returns",
    },
    { label: "Users", value: stats.users, to: "/admin" },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Dashboard
        </h2>
        <p className="mt-1 text-slate-500">
          Live snapshot of your TechStore operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card, index) => {
          const style = cardStyles[index % cardStyles.length];
          return (
            <Link
              key={card.label}
              to={card.to}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.ring}`}
            >
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.accent}`}
              />
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="font-display mt-3 text-4xl font-extrabold tracking-tight">
                {card.value}
              </p>
              <p className="mt-3 text-xs font-semibold text-brand opacity-0 transition group-hover:opacity-100">
                Open →
              </p>
            </Link>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-display text-lg font-bold">Orders by product</h3>
          <p className="text-sm text-slate-500">
            Share of units sold — which products get ordered the most
          </p>
        </div>
        <ProductOrdersPieChart slices={productOrders} />
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white shadow-sm shadow-slate-900/5">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="font-display text-lg font-bold">Recent orders</h3>
            <p className="text-sm text-slate-500">Latest checkout activity</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Placed</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-slate-400">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recent.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-t border-slate-50 transition hover:bg-sky-50/40"
                  >
                    <td className="px-5 py-3.5 font-semibold">{order.orderId}</td>
                    <td className="px-5 py-3.5 font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${paymentTone(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(order.placedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

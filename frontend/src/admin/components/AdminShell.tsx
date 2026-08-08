import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";

const links = [
  { to: "/admin", label: "Dashboard", end: true, hint: "Overview" },
  { to: "/admin/products", label: "Products", hint: "Catalog" },
  { to: "/admin/orders", label: "Orders", hint: "Active" },
  { to: "/admin/order-history", label: "Order History", hint: "Delivered" },
  { to: "/admin/reviews", label: "Reviews", hint: "Moderation" },
  { to: "/admin/returns", label: "Returns", hint: "RMA" },
];

function NavItems({ compact = false }: { compact?: boolean }) {
  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            compact
              ? `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              : `rounded-xl px-3 py-2.5 transition ${
                  isActive
                    ? "bg-brand text-white shadow-sm shadow-brand/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                }`
          }
        >
          {compact ? (
            link.label
          ) : (
            <span className="flex flex-col">
              <span className="text-sm font-semibold">{link.label}</span>
              <span className="text-[11px] text-current/70">{link.hint}</span>
            </span>
          )}
        </NavLink>
      ))}
    </>
  );
}

function AccountActions({
  compact = false,
}: {
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const { logout } = useStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const goAsUser = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goAsUser}
          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-brand"
        >
          Shop as user
        </button>
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => void handleLogout()}
          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
        >
          {loggingOut ? "..." : "Logout"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1 border-t border-slate-100 p-3">
      <button
        type="button"
        onClick={goAsUser}
        className="flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-100"
      >
        <span className="text-sm font-semibold text-ink">Shop as user</span>
        <span className="text-[11px] text-slate-400">
          Open the storefront (stay logged in)
        </span>
      </button>
      <button
        type="button"
        disabled={loggingOut}
        onClick={() => void handleLogout()}
        className="flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition hover:bg-rose-50 disabled:opacity-60"
      >
        <span className="text-sm font-semibold text-rose-600">
          {loggingOut ? "Logging out..." : "Logout"}
        </span>
        <span className="text-[11px] text-rose-400/80">End admin session</span>
      </button>
    </div>
  );
}

export default function AdminShell() {
  const { user } = useStore();

  return (
    <div className="relative min-h-screen bg-[#f4f7fb] text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top_left,rgb(37_99_235/0.14),transparent_55%),radial-gradient(ellipse_at_top_right,rgb(14_165_233/0.1),transparent_50%)]"
      />

      <div className="relative flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/80 backdrop-blur-xl md:flex">
          <div className="border-b border-slate-100 px-5 py-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
              TechStore
            </p>
            <h1 className="font-display mt-1 text-2xl font-extrabold tracking-tight">
              Admin
            </h1>
            {user?.email ? (
              <p className="mt-2 truncate text-xs text-slate-400">{user.email}</p>
            ) : null}
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-3">
            <NavItems />
          </nav>

          <AccountActions />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
              <div className="md:hidden">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
                  TechStore
                </p>
                <h1 className="font-display text-xl font-extrabold">Admin</h1>
              </div>
              <p className="hidden text-sm text-slate-500 md:block">
                Manage catalog, orders, reviews, and returns in one place.
              </p>
              <div className="md:hidden">
                <AccountActions compact />
              </div>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
              <NavItems compact />
            </nav>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

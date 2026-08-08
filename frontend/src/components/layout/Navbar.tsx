import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "@/lib/products";
import { useStore } from "@/context/StoreContext";
import SearchBar from "@/components/layout/SearchBar";
import { CartIcon, HeartIcon, UserIcon } from "@/components/ui/icons";

const AVATAR_COLORS = [
  "#2563EB",
  "#0D9488",
  "#7C3AED",
  "#DB2777",
  "#EA580C",
  "#059669",
  "#4F46E5",
  "#CA8A04",
  "#DC2626",
  "#0891B2",
];

function getInitials(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function getAvatarColor(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { wishlistCount, cartCount, isLoggedIn, requireAuth, logout, user } =
    useStore();

  const goProtected = (path: string) => {
    if (!requireAuth()) return;
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)] backdrop-blur-xl">
      <div className="page-shell flex h-[4.75rem] items-center gap-6 lg:gap-8">
        <Link
          to="/"
          className="font-display text-2xl font-extrabold tracking-tight text-brand transition-opacity hover:opacity-90 sm:text-3xl"
        >
          TechStore
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href !== "#" &&
              (pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`)));
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`relative text-[0.95rem] font-semibold transition-colors ${
                  active ? "text-brand" : "text-slate-600 hover:text-ink"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-brand" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <SearchBar />

          <IconButton
            label="Wishlist"
            active={pathname === "/wishlist"}
            badge={wishlistCount || undefined}
            onClick={() => goProtected("/wishlist")}
          >
            <HeartIcon className="h-6 w-6" />
          </IconButton>

          <IconButton
            label="Cart"
            active={pathname === "/cart"}
            badge={cartCount || undefined}
            onClick={() => goProtected("/cart")}
          >
            <CartIcon className="h-6 w-6" />
          </IconButton>

          <ProfileMenu
            isLoggedIn={isLoggedIn}
            name={user?.name}
            email={user?.email}
            active={pathname === "/login" || pathname === "/signup"}
            onLogout={async () => {
              await logout();
              navigate("/login");
            }}
          />
        </div>
      </div>
    </header>
  );
}

interface ProfileMenuProps {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
  active?: boolean;
  onLogout: () => Promise<void>;
}

function ProfileMenu({
  isLoggedIn,
  name,
  email,
  active,
  onLogout,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const initials = useMemo(() => getInitials(name), [name]);
  const avatarColor = useMemo(
    () => getAvatarColor(email || name || "user"),
    [email, name],
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={isLoggedIn ? (name ? `Account: ${name}` : "Account") : "Account"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`rounded-full p-0.5 transition-shadow ${
          open || active
            ? "ring-2 ring-brand/30 ring-offset-2"
            : "hover:ring-2 hover:ring-slate-200 hover:ring-offset-1"
        }`}
      >
        {isLoggedIn ? (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </span>
        ) : (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 ${
              open || active ? "text-brand" : "text-slate-600"
            }`}
          >
            <UserIcon className="h-5 w-5" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-xl animate-fade-in">
          {isLoggedIn ? (
            <>
              <div className="bg-gradient-to-br from-sky-50/80 via-white to-white px-4 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white shadow-md"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-ink">
                      {name || "User"}
                    </p>
                    {email ? (
                      <p className="mt-0.5 truncate text-sm text-slate-500">
                        {email}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 p-2">
                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand/5 hover:text-brand"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <OrdersIcon className="h-4 w-4" />
                  </span>
                  My Orders
                </Link>
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={() => void handleLogout()}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-60"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                    <LogoutIcon className="h-4 w-4" />
                  </span>
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </>
          ) : (
            <div className="p-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand/5 hover:text-brand"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <UserIcon className="h-4 w-4" />
                </span>
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

interface IconButtonProps {
  label: string;
  badge?: number;
  to?: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function IconButton({ label, badge, to, active, onClick, children }: IconButtonProps) {
  const className = `relative rounded-full p-2.5 transition-all hover:bg-brand/5 hover:text-brand ${
    active ? "bg-brand/5 text-brand" : "text-slate-600"
  }`;

  const inner = (
    <>
      {children}
      {badge !== undefined && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} aria-label={label} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

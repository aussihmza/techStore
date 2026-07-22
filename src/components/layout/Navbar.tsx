import { Link, useLocation } from "react-router-dom";
import { navLinks } from "@/lib/products";
import { useStore } from "@/context/StoreContext";
import { CartIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/ui/icons";

export default function Navbar() {
  const { pathname } = useLocation();
  const { wishlistCount, cartCount } = useStore();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-20 w-full items-center gap-8 px-4 sm:px-6 lg:px-10 xl:px-14">
        <Link to="/" className="text-3xl font-extrabold tracking-tight text-brand">
          TechStore
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href !== "#" &&
              (pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`)));
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`relative text-base font-medium transition-colors ${
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

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 lg:flex">
            <SearchIcon className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-44 bg-transparent px-2 text-base text-slate-700 outline-none placeholder:text-slate-400 xl:w-64"
            />
          </div>

          <IconButton
            label="Wishlist"
            to="/wishlist"
            active={pathname === "/wishlist"}
            badge={wishlistCount || undefined}
          >
            <HeartIcon className="h-6 w-6" />
          </IconButton>

          <IconButton
            label="Cart"
            to="/cart"
            active={pathname === "/cart"}
            badge={cartCount || undefined}
          >
            <CartIcon className="h-6 w-6" />
          </IconButton>

          <IconButton label="Account">
            <UserIcon className="h-6 w-6" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

interface IconButtonProps {
  label: string;
  badge?: number;
  to?: string;
  active?: boolean;
  children: React.ReactNode;
}

function IconButton({ label, badge, to, active, children }: IconButtonProps) {
  const className = `relative rounded-full p-2 transition-colors hover:bg-slate-100 hover:text-brand ${
    active ? "text-brand" : "text-slate-600"
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
    <button type="button" aria-label={label} className={className}>
      {inner}
    </button>
  );
}

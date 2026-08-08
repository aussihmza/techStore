import { Link } from "react-router-dom";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

type AuthMode = "login" | "signup" | "forgot" | "reset";

interface AuthShellProps {
  mode: AuthMode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthShell({ mode, title, subtitle, children }: AuthShellProps) {
  const showTabs = mode === "login" || mode === "signup";
  const showGoogle = showTabs;

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-sky-100/60 blur-3xl"
      />

      <div className="relative w-full max-w-md animate-fade-up rounded-[1.5rem] border border-white/70 bg-white/90 p-8 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.45)] backdrop-blur-xl sm:p-10">
        {showTabs ? (
          <div className="mb-8 flex gap-8 border-b border-slate-100">
            <TabLink to="/login" active={mode === "login"}>
              Login
            </TabLink>
            <TabLink to="/signup" active={mode === "signup"}>
              Create Account
            </TabLink>
          </div>
        ) : (
          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand"
          >
            <span aria-hidden>←</span> Back to login
          </Link>
        )}

        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-brand">
          TechStore
        </p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-ink">
          {title}
        </h1>
        <p className="section-sub mt-2 text-base">{subtitle}</p>

        <div className="mt-8">{children}</div>

        {showGoogle ? (
          <div className="mt-8">
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-slate-200" />
              <span className="relative bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Or continue with
              </span>
            </div>

            <div className="mt-5">
              <GoogleSignInButton />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function TabLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`relative pb-3 text-sm font-semibold transition-colors ${
        active ? "text-brand" : "text-slate-400 hover:text-slate-600"
      }`}
    >
      {children}
      {active && (
        <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" />
      )}
    </Link>
  );
}

export function AuthField({
  label,
  htmlFor,
  action,
  children,
}: {
  label: string;
  htmlFor: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-600">
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}

export const authInputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 transition-shadow focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15";

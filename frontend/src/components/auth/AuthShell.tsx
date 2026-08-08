import { Link } from "react-router-dom";
import { AppleIcon, GoogleIcon } from "@/components/ui/icons";

type AuthMode = "login" | "signup" | "forgot" | "reset";

interface AuthShellProps {
  mode: AuthMode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthShell({ mode, title, subtitle, children }: AuthShellProps) {
  const showTabs = mode === "login" || mode === "signup";
  const showSocial = showTabs;

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

      <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
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

        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-base text-slate-500">{subtitle}</p>

        <div className="mt-8">{children}</div>

        {showSocial ? (
          <div className="mt-8">
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-slate-200" />
              <span className="relative bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Or continue with
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <SocialButton label="Google" icon={<GoogleIcon className="h-5 w-5" />} />
              <SocialButton label="Apple" icon={<AppleIcon className="h-5 w-5" />} />
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

function SocialButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-slate-50"
    >
      {icon}
      {label}
    </button>
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
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15";

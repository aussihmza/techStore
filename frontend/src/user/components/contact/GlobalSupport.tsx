import { Link } from "react-router-dom";
import { MailIcon, ShieldIcon, TruckIcon } from "@/user/components/ui/icons";

const SUPPORT_EMAIL = "support@techstore.com";

const channels = [
  {
    title: "Contact form",
    body: "Best for order questions, product help, and volume inquiries. We reply to the email you submit in the form.",
    action: { label: "Use the form on this page", href: "#contact-form" },
  },
  {
    title: "Email support",
    body: "Prefer email directly? Send your order ID and question — we use the same inbox as form submissions.",
    action: {
      label: SUPPORT_EMAIL,
      href: `mailto:${SUPPORT_EMAIL}`,
      external: true,
    },
  },
  {
    title: "Orders & shipping",
    body: "Track delivery status, returns, and warranty steps in Customer Service — no phone hub required.",
    action: { label: "Open support pages", href: "/support" },
  },
];

export default function GlobalSupport() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink">How to reach us</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        TechStore support is online-first. There are no public walk-in offices listed here — use the
        form or email below.
      </p>

      <div className="mt-6 space-y-4">
        {channels.map((channel) => (
          <div
            key={channel.title}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <h3 className="text-base font-semibold text-ink">{channel.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{channel.body}</p>
            {"external" in channel.action && channel.action.external ? (
              <a
                href={channel.action.href}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
              >
                <MailIcon className="h-4 w-4" />
                {channel.action.label}
              </a>
            ) : channel.action.href.startsWith("#") ? (
              <a
                href={channel.action.href}
                className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
              >
                {channel.action.label}
              </a>
            ) : (
              <Link
                to={channel.action.href}
                className="mt-3 inline-flex text-sm font-semibold text-brand hover:underline"
              >
                {channel.action.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <TruckIcon className="h-4 w-4" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">Shipping & tracking</p>
          <Link
            to="/support#shipping-info"
            className="mt-1 inline-block text-sm font-medium text-brand hover:underline"
          >
            View shipping info
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <ShieldIcon className="h-4 w-4" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">Returns & warranty</p>
          <Link
            to="/support#returns-warranty"
            className="mt-1 inline-block text-sm font-medium text-brand hover:underline"
          >
            View policy
          </Link>
        </div>
      </div>
    </div>
  );
}

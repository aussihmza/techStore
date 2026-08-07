import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";

const offices = [
  {
    title: "North America Hub",
    address: "1500 Silicon Valley Blvd, Palo Alto, CA, USA",
    phone: "+1 (650) 555-0198",
    email: "support@techstore.com",
  },
  {
    title: "European Design Studio",
    address: "Friedrichstraße 123, 10117 Berlin, Germany",
    phone: "+49 (30) 234-5678",
    email: "design.eu@techstore.com",
  },
  {
    title: "APAC Logistics Center",
    address: "8 Marina Blvd, Level 12, Singapore 018981",
    phone: "+65 6789-0123",
    email: "sos.apac@techstore.com",
  },
];

export default function GlobalSupport() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-ink">Global Support</h2>

      <div className="mt-6 space-y-4">
        {offices.map((office) => (
          <div key={office.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">{office.title}</h3>
                <p className="mt-0.5 text-sm text-slate-500">{office.address}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <a href={`tel:${office.phone}`} className="flex items-center gap-2 text-brand">
                    <PhoneIcon className="h-4 w-4" />
                    {office.phone}
                  </a>
                  <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-brand">
                    <MailIcon className="h-4 w-4" />
                    {office.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl">
        <img
          src="/contact/Support.svg"
          alt="24/7 priority support"
          className="h-40 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-slate-900/20" />
        <div className="absolute bottom-0 p-5">
          <h3 className="text-lg font-bold text-white">24/7 Priority Support</h3>
          <p className="text-sm text-slate-200">Global assistance by Enterprise partners.</p>
        </div>
      </div>
    </div>
  );
}

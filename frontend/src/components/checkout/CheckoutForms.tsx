import { ArrowRightIcon } from "@/components/ui/icons";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white/95 px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/15";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

interface StepSectionProps {
  step: number;
  title: string;
  children: React.ReactNode;
}

export function StepSection({ step, title, children }: StepSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.2)] backdrop-blur-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-md shadow-brand/30">
          {step}
        </span>
        <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

interface PaymentOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function PaymentOption({ label, selected, onSelect }: PaymentOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all ${
        selected
          ? "border-brand bg-brand/5 text-brand shadow-sm shadow-brand/15"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export function PlaceOrderButton({
  disabled,
  label = "Place Order",
  loadingLabel = "Placing order...",
}: {
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:transform-none"
    >
      {disabled ? loadingLabel : label}
      <ArrowRightIcon className="h-5 w-5" />
    </button>
  );
}

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
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-slate-400 focus:border-brand";

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
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {step}
        </span>
        <h2 className="text-xl font-bold text-ink">{title}</h2>
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
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
        selected
          ? "border-brand bg-brand/5 text-brand"
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
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled ? loadingLabel : label}
      <ArrowRightIcon className="h-5 w-5" />
    </button>
  );
}

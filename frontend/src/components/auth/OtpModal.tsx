import { useEffect, useRef, useState, type FormEvent } from "react";

interface OtpModalProps {
  open: boolean;
  email: string;
  loading?: boolean;
  error?: string;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

export default function OtpModal({
  open,
  email,
  loading = false,
  error = "",
  onClose,
  onVerify,
  onResend,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setOtp("");
      return;
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onVerify(otp.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <span className="text-2xl leading-none">&times;</span>
        </button>

        <h2 id="otp-modal-title" className="text-2xl font-extrabold text-ink">
          Enter OTP
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-ink">{email}</span>
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="••••••"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center text-2xl font-bold tracking-[0.4em] text-ink outline-none placeholder:tracking-[0.4em] focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
          />

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          type="button"
          disabled={loading}
          onClick={onResend}
          className="mt-4 w-full text-center text-sm font-medium text-brand hover:underline disabled:opacity-60"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}

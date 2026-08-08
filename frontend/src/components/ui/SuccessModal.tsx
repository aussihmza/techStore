import { CheckCircleIcon } from "@/components/ui/icons";

interface SuccessModalProps {
  open: boolean;
  title: string;
  message?: string;
  onClose: () => void;
}

export default function SuccessModal({
  open,
  title,
  message,
  onClose,
}: SuccessModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md animate-fade-up rounded-[1.5rem] border border-white/70 bg-white/95 p-8 shadow-2xl backdrop-blur-xl"
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

        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/35">
          <CheckCircleIcon className="h-7 w-7" />
        </span>

        <h2
          id="success-modal-title"
          className="font-display mt-5 text-2xl font-extrabold text-ink"
        >
          {title}
        </h2>
        {message ? (
          <p className="section-sub mt-2 text-base">{message}</p>
        ) : null}

        <button type="button" onClick={onClose} className="btn-primary mt-8 w-full">
          OK
        </button>
      </div>
    </div>
  );
}

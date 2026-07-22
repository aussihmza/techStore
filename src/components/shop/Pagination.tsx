import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

interface PaginationProps {
  pages?: number;
}

export default function Pagination({ pages = 12 }: PaginationProps) {
  const [current, setCurrent] = useState(1);
  const visible = [1, 2, 3];

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <PageButton
        ariaLabel="Previous page"
        disabled={current === 1}
        onClick={() => setCurrent((p) => Math.max(1, p - 1))}
      >
        <ChevronDownIcon className="h-4 w-4 rotate-90" />
      </PageButton>

      {visible.map((page) => (
        <PageButton key={page} active={page === current} onClick={() => setCurrent(page)}>
          {page}
        </PageButton>
      ))}

      <span className="px-1 text-slate-400">…</span>

      <PageButton active={pages === current} onClick={() => setCurrent(pages)}>
        {pages}
      </PageButton>

      <PageButton
        ariaLabel="Next page"
        disabled={current === pages}
        onClick={() => setCurrent((p) => Math.min(pages, p + 1))}
      >
        <ChevronDownIcon className="h-4 w-4 -rotate-90" />
      </PageButton>
    </div>
  );
}

interface PageButtonProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick: () => void;
}

function PageButton({ children, active, disabled, ariaLabel, onClick }: PageButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-brand bg-brand text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

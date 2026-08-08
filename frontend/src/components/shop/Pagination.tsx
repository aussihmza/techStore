import { ChevronDownIcon } from "@/components/ui/icons";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getVisiblePages(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, page]);
  for (let offset = 1; offset <= 1; offset += 1) {
    if (page - offset > 1) pages.add(page - offset);
    if (page + offset < totalPages) pages.add(page + offset);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (let i = 0; i < sorted.length; i += 1) {
    const current = sorted[i];
    const prev = sorted[i - 1];
    if (i > 0 && current - prev > 1) {
      result.push("ellipsis");
    }
    result.push(current);
  }

  return result;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const visible = getVisiblePages(page, totalPages);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <PageButton
        ariaLabel="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronDownIcon className="h-4 w-4 rotate-90" />
      </PageButton>

      {visible.map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <PageButton
            key={item}
            active={item === page}
            onClick={() => onPageChange(item)}
          >
            {item}
          </PageButton>
        ),
      )}

      <PageButton
        ariaLabel="Next page"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
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
      className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-brand bg-brand text-white shadow-md shadow-brand/30"
          : "border-slate-200 bg-white/90 text-slate-600 hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

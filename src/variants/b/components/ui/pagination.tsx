import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from '@/variants/b/icons';

const BOX =
  'flex size-8 items-center justify-center rounded-(--ob-radius-control) bg-(--ob-white) ring-1 ring-inset transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/30';

/**
 * Option B pagination: small white boxes with a hairline and 6px corners, no
 * fill. The current page has a 1px blue border and blue text; page numbers in
 * Geist Mono.
 */
export function Pagination({ page, total, onPage, className }: {
  page: number;
  total: number;
  onPage: (page: number) => void;
  className?: string;
}) {
  const arrow = cn(BOX, 'text-(--ob-text-body) ring-(--ob-border) hover:text-(--ob-text-strong) hover:ring-(--ob-border-control) disabled:cursor-not-allowed disabled:opacity-40');
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <button type="button" aria-label="Previous page" onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className={arrow}>
        <ChevronLeft className="size-4" />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            BOX,
            'ob-num text-[12px]',
            p === page ? 'text-(--ob-primary-strong) ring-(--ob-primary)' : 'text-(--ob-text-secondary) ring-(--ob-border) hover:text-(--ob-text-strong) hover:ring-(--ob-border-control)',
          )}
        >
          {p}
        </button>
      ))}
      <button type="button" aria-label="Next page" onClick={() => onPage(Math.min(total, page + 1))} disabled={page === total} className={arrow}>
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight } from '@/variants/b/icons';
import { NisaOrb } from '@/variants/b/components/ui/NisaOrb';
import { CARD } from '@/variants/b/components/ui/kit';
import type { NisaInsight } from '../types/dashboard.types';

interface LDDashboardNissaInsightProps {
  /** Built from the programs and divisions on the page (see dashboard.mock.ts) */
  insights: NisaInsight[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Insight row                                                        */
/* ------------------------------------------------------------------ */

function InsightRow({ item }: { item: NisaInsight }) {
  return (
    <div className="group py-3 first:pt-0 last:pb-0">
      {/* Title and its action on one row */}
      <div className="flex items-baseline justify-between gap-3">
        <p className="min-w-0 truncate text-[15px] leading-[22px] text-(--ob-text-ai)">{item.title}</p>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 text-[13px] text-(--ob-primary) transition-colors hover:text-(--ob-primary-strong)"
        >
          {item.cta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      {/* Two lines at most; the full text is in the title tooltip */}
      <p className="mt-1 line-clamp-2 text-[13px] leading-[20px] text-(--ob-text-ai)/70" title={item.description}>
        {item.description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/** Option B AI card: white with a hairline frame; the orb sits in a soft blue glow, like the reference's assistant */
export function LDDashboardNissaInsight({ insights, className }: LDDashboardNissaInsightProps) {
  return (
    <div className={cn(CARD, 'relative w-full overflow-hidden p-5', className)}>
      {/* Faint glow behind the orb */}
      <span className="pointer-events-none absolute -left-10 -top-12 size-44 rounded-full bg-(--ob-primary)/10 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-4">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <NisaOrb size={40} />
          <div>
            <h3 className="text-[16px] leading-[24px] text-(--ob-text-strong)">NISA priority insights</h3>
            <p className="text-[13px] leading-[18px] text-(--ob-text-muted)">Smart insights tailored to you</p>
          </div>
        </div>

        {/* ── Insight rows, split by thin lines ──────────────── */}
        <div className="divide-y divide-(--ob-border)">
          {insights.map((item) => (
            <InsightRow key={item.title} item={item} />
          ))}
        </div>

        {/* ── Footer CTA ─────────────────────────────────────── */}
        <button
          type="button"
          className="group flex h-11 items-center justify-between rounded-full bg-(--ob-surface) px-5 text-[13px] text-(--ob-primary) transition-colors hover:bg-(--ob-primary-50)"
        >
          More insights? Just ask NISA
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

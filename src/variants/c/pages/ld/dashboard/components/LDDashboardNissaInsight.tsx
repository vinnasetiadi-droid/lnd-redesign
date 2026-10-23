import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight } from '@/variants/c/icons';
import { NisaOrb } from '@/variants/c/components/ui/NisaOrb';
import { OC_AI_SOLID } from '@/variants/c/theme';
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
        <p className="min-w-0 truncate text-[15px] leading-[22px] font-medium text-(--oc-white)">{item.title}</p>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 text-[13px] text-(--oc-white)/80 transition-colors hover:text-(--oc-white)"
        >
          {item.cta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      {/* Two lines at most; the full text is in the title tooltip */}
      <p className="mt-1 line-clamp-2 text-[13px] leading-[20px] text-(--oc-white)/65" title={item.description}>
        {item.description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/** Option C AI card: black into grey blue (the AI gradient), white text, no inner frames */
export function LDDashboardNissaInsight({ insights, className }: LDDashboardNissaInsightProps) {
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-(--oc-radius-card) p-5', className)}
      style={{ background: OC_AI_SOLID }}
    >
      <div className="relative flex flex-col gap-4">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <NisaOrb size={40} />
          <div>
            <p className="text-[20px] leading-[28px] font-medium text-(--oc-white)">NISA priority insights</p>
            <p className="text-[14px] leading-[20px] text-(--oc-white)/65">Smart insights tailored to you</p>
          </div>
        </div>

        {/* ── Insight rows, split by thin lines ──────────────── */}
        <div className="divide-y divide-(--oc-white)/12">
          {insights.map((item) => (
            <InsightRow key={item.title} item={item} />
          ))}
        </div>

        {/* ── Footer CTA ─────────────────────────────────────── */}
        <button
          type="button"
          className="group flex h-10 items-center justify-between rounded-(--oc-radius-control) bg-(--oc-white)/10 px-4 text-[13px] text-(--oc-white) ring-1 ring-inset ring-(--oc-white)/20 backdrop-blur-sm transition-colors hover:bg-(--oc-white)/16"
        >
          More insights? Just ask NISA
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

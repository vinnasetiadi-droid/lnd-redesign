import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight } from '@/variants/a/icons';
import { NisaOrb } from '@/variants/a/components/ui/NisaOrb';
import { OA_AI_SOFT } from '@/variants/a/theme';
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
    <div className="group py-3.5 first:pt-0 last:pb-0">
      <p className="text-[16px] leading-[24px] text-(--oa-text-ai)">{item.title}</p>
      {/* Two lines at most; the full text is in the title tooltip */}
      <p className="mt-1 line-clamp-2 text-[13px] leading-[20px] text-(--oa-text-ai)/70" title={item.description}>
        {item.description}
      </p>
      <button
        type="button"
        className="mt-2 inline-flex items-center gap-1 text-[13px] text-(--oa-primary) transition-colors hover:text-(--oa-primary-strong)"
      >
        {item.cta}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/** Option A AI card: mostly white with a soft blue glow, #282828 text, no inner frames */
export function LDDashboardNissaInsight({ insights, className }: LDDashboardNissaInsightProps) {
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-[18px] p-5', className)}
      style={{ background: OA_AI_SOFT }}
    >
      <div className="relative flex flex-col gap-5">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <NisaOrb size={40} />
          <div>
            <p className="text-[20px] leading-[28px] text-(--oa-text-ai)">NISA priority insights</p>
            <p className="text-[14px] leading-[20px] text-(--oa-text-ai)/70">Smart insights tailored to you</p>
          </div>
        </div>

        {/* ── Insight rows, split by thin lines ──────────────── */}
        <div className="divide-y divide-(--oa-text-ai)/10">
          {insights.map((item) => (
            <InsightRow key={item.title} item={item} />
          ))}
        </div>

        {/* ── Footer CTA ─────────────────────────────────────── */}
        <button
          type="button"
          className="group flex items-center justify-between rounded-full bg-white/80 ring-1 ring-(--oa-primary)/15 px-5 h-10 text-[14px] text-(--oa-primary) transition-colors hover:bg-white"
        >
          More insights? Just ask NISA
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

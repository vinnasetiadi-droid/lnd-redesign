import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight } from '@/variants/b/icons';
import { NisaOrb } from '@/variants/b/components/ui/NisaOrb';
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
        <p className="min-w-0 truncate text-[15px] leading-[22px] text-white">{item.title}</p>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 text-[13px] text-white transition-colors hover:text-white/75 cursor-pointer"
        >
          {item.cta}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      {/* Two lines at most; the full text is in the title tooltip */}
      <p className="mt-1 line-clamp-2 text-[13px] leading-[20px] text-white/75" title={item.description}>
        {item.description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/**
 * Option B AI card, solid blue like the reference's promo card: a deep blue
 * gradient, a faint dot pattern in the top corner, white text, and a bright
 * blue button at the bottom.
 */
export function LDDashboardNissaInsight({ insights, className }: LDDashboardNissaInsightProps) {
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-[18px] p-5', className)}
      style={{ background: 'linear-gradient(160deg, var(--ob-primary) 0%, var(--ob-primary-900) 100%)' }}
    >
      {/* Dot pattern, fading out from the top right corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1.2px)',
          backgroundSize: '10px 10px',
          maskImage: 'radial-gradient(60% 55% at 100% 0%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(60% 55% at 100% 0%, black, transparent)',
        }}
      />
      <div className="relative flex flex-col gap-4">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <NisaOrb size={40} />
          <div>
            <h3 className="text-[16px] leading-[24px] text-white">NISA priority insights</h3>
            <p className="text-[13px] leading-[18px] text-white/70">Smart insights tailored to you</p>
          </div>
        </div>

        {/* ── Insight rows, split by thin lines ──────────────── */}
        <div className="divide-y divide-white/15">
          {insights.map((item) => (
            <InsightRow key={item.title} item={item} />
          ))}
        </div>

        {/* ── Footer CTA ─────────────────────────────────────── */}
        <button
          type="button"
          className="group flex h-11 items-center justify-between rounded-full bg-(--ob-primary) px-5 text-[13px] text-white shadow-[0_8px_20px_-8px_rgba(26,115,232,0.9)] ring-1 ring-white/20 transition-colors hover:bg-(--ob-primary-strong) cursor-pointer"
        >
          More insights? Just ask NISA
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

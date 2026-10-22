import { cn } from '@/lib/utils';
import { ArrowRight, ChevronRight } from '@/variants/a/icons';
import { NisaOrb } from '@/variants/a/components/ui/NisaOrb';
import { OA_AI_SOFT } from '@/variants/a/theme';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NissaInsightItem {
  title: string;
  description: string;
  cta: string;
}

interface LDDashboardNissaInsightProps {
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data — L&D specific                                           */
/* ------------------------------------------------------------------ */

const insights: NissaInsightItem[] = [
  {
    title: 'Course At-Risk',
    description:
      "Module 4 in 'Leadership Foundations' has a 58% first-attempt fail rate. The issue is likely content complexity or delivery gap. Consider splitting into 2 shorter modules.",
    cta: 'Review Module',
  },
  {
    title: 'Attention Required',
    description:
      'Legal division completion rate dropped to 80.3%. Consider scheduling a review with the division lead.',
    cta: 'View Division',
  },
  {
    title: 'Trainer Rating',
    description:
      "Trainer Budi Santoso's last two events averaged 3.1/5.0, due to low engagement scores. Consider scheduling a review.",
    cta: 'View Trainer',
  },
];

/* ------------------------------------------------------------------ */
/*  Insight row                                                        */
/* ------------------------------------------------------------------ */

function InsightRow({ item }: { item: NissaInsightItem }) {
  return (
    <div className="group py-3.5 first:pt-0 last:pb-0">
      <p className="text-[16px] leading-[24px] text-[#282828]">{item.title}</p>
      {/* Two lines at most; the full text is in the title tooltip */}
      <p className="mt-1 line-clamp-2 text-[13px] leading-[20px] text-[#282828]/70" title={item.description}>
        {item.description}
      </p>
      <button
        type="button"
        className="mt-2 inline-flex items-center gap-1 text-[13px] text-[#1A73E8] transition-colors hover:text-[#1967D2]"
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
export function LDDashboardNissaInsight({ className }: LDDashboardNissaInsightProps) {
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
            <p className="text-[20px] leading-[28px] text-[#282828]">NISA Priority Insight</p>
            <p className="text-[14px] leading-[20px] text-[#282828]/70">Smart insights tailored to you</p>
          </div>
        </div>

        {/* ── Insight rows, split by thin lines ──────────────── */}
        <div className="divide-y divide-[#282828]/10">
          {insights.map((item) => (
            <InsightRow key={item.title} item={item} />
          ))}
        </div>

        {/* ── Footer CTA ─────────────────────────────────────── */}
        <button
          type="button"
          className="group flex items-center justify-between rounded-full bg-white/80 ring-1 ring-[#1A73E8]/15 px-5 h-10 text-[14px] text-[#1A73E8] transition-colors hover:bg-white"
        >
          More insights? Just ask NISA
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

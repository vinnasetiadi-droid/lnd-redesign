import { cn } from '@/lib/utils';
import { AlertTriangle, Eye, Star, type LucideIcon } from 'lucide-react';

const SVG_PATHS = {
  severity: 'M7.75 0C3.47 0 0 3.47 0 7.75s3.47 7.75 7.75 7.75 7.75-3.47 7.75-7.75S12.03 0 7.75 0zm.75 11.63h-1.5V10.13h1.5v1.5zm0-3h-1.5V3.88h1.5v4.75z',
  sparkleHeader: 'M12.24 1.53l2.83 5.73 6.32.92-4.57 4.46 1.08 6.29-5.66-2.98-5.66 2.98 1.08-6.29L2.09 8.18l6.32-.92 2.83-5.73z',
  sparkleCta: 'M8.9 0l2.06 4.17 4.6.67-3.33 3.24.79 4.58L8.9 10.49 4.78 12.66l.79-4.58L2.24 4.84l4.6-.67L8.9 0z',
} as const;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type InsightSeverity = 'critical' | 'warning' | 'positive';

interface NissaInsightItem {
  title: string;
  description: string;
  cta: string;
  severity: InsightSeverity;
  icon: LucideIcon;
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
    severity: 'critical',
    icon: AlertTriangle,
  },
  {
    title: 'Attention Required',
    description:
      'Legal division completion rate dropped to 80.3%. Consider scheduling a review with the division lead.',
    cta: 'View Division',
    severity: 'warning',
    icon: Eye,
  },
  {
    title: 'Trainer Rating',
    description:
      "Trainer Budi Santoso's last two events averaged 3.1/5.0, due to low engagement scores. Consider scheduling a review.",
    cta: 'View Trainer',
    severity: 'warning',
    icon: Star,
  },
];

/* ------------------------------------------------------------------ */
/*  Insight icon                                                       */
/* ------------------------------------------------------------------ */

function InsightIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="bg-white/20 flex items-center justify-center rounded-xl shadow-[0_6px_10px_rgba(0,0,0,0.1),0_2.5px_4px_rgba(0,0,0,0.05)] shrink-0 size-10">
      <Icon className="size-5 text-white" strokeWidth={2} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Insight row                                                        */
/* ------------------------------------------------------------------ */

function InsightRow({ item }: { item: NissaInsightItem }) {
  return (
    <div className="relative bg-white/15 rounded-xl w-full">
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-xl border border-white/30 pointer-events-none shadow-[0_11px_17px_rgba(0,0,0,0.1),0_4.5px_7px_rgba(0,0,0,0.05)]"
      />
      <div className="flex items-center gap-3.5 px-4 py-2.5 relative w-full">
        {/* text */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <p className="text-[14px] font-semibold text-white capitalize leading-[20px]">
            {item.title}
          </p>
          <p className="text-[11px] text-white/70 leading-normal">
            {item.description}
          </p>
          <p className="text-[11px] font-semibold text-white leading-normal">
            {item.cta}
          </p>
        </div>
        {/* severity icon */}
        <InsightIcon icon={item.icon} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function LDDashboardNissaInsight({ className }: LDDashboardNissaInsightProps) {
  return (
    <div className={cn('w-full', className)}>
      <div
        className="relative rounded-2xl w-full"
        style={{
          backgroundImage:
            'linear-gradient(224deg, rgb(27, 121, 244) 14.72%, rgb(29, 39, 112) 68.35%)',
        }}
      >
        {/* border overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl border border-white/60 pointer-events-none shadow-[0_9px_18px_rgba(5,93,255,0.25)]"
        />

        <div className="flex flex-col items-center gap-3 px-5 py-6 relative w-full">
          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex items-center gap-3 w-full py-2">
            <div className="flex items-center justify-center rounded-lg bg-white/25 shrink-0 size-10">
              <div className="relative size-6 overflow-clip">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24.4737 24.4737"
                >
                  <path d={SVG_PATHS.sparkleHeader} fill="#F7F7F7" />
                </svg>
              </div>
            </div>
            <p className="text-base font-medium text-white capitalize leading-snug">
              NISA Priority Insight
            </p>
          </div>

          {/* ── Insight rows ───────────────────────────────────── */}
          <div className="flex flex-col gap-4 w-full">
            {insights.map((item) => (
              <InsightRow key={item.title} item={item} />
            ))}
          </div>

          {/* ── Footer CTA ─────────────────────────────────────── */}
          <div className="flex items-center justify-center gap-2 py-1 cursor-pointer group">
            <div className="relative size-[18px] overflow-clip">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 17.799 17.799"
              >
                <path
                  d={SVG_PATHS.sparkleCta}
                  fill="url(#paint0_linear_nissa_cta)"
                />
                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="paint0_linear_nissa_cta"
                    x1="0"
                    x2="17.799"
                    y1="8.89952"
                    y2="8.89952"
                  >
                    <stop stopColor="#7995E7" />
                    <stop offset="0.504808" stopColor="#4891D7" />
                    <stop stopColor="#74CED8" offset="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="text-sm font-medium bg-gradient-to-r from-[#7995e7] via-[#4891d7] to-[#74ced8] bg-clip-text text-transparent whitespace-nowrap group-hover:opacity-80 transition-opacity">
              More Insights? Just ask me
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Building2 } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import { AIInsightLine } from '@/variants/a/components/ui/ai-insight-banner';
import type { DivisionPerformance } from '../types/dashboard.types';
import { CardHeader, Trend } from '@/variants/a/components/ui/kit';
import { CHART_BLUE, HATCHED_TRACK } from '@/variants/a/components/ui/chart';
import { CountUp, GROW } from '@/variants/a/components/ui/count-up';

interface DashboardDivisionsPerformanceProps {
  divisions: DivisionPerformance[];
  latestSupport: string;
  insight?: string;
  className?: string;
}

// ── Static chart data (matching Figma), best score first ─────

const DIVISIONS = [
  { name: 'Data & Analytics', score: 92 },
  { name: 'Product', score: 87 },
  { name: 'DevOps', score: 84 },
  { name: 'Strategy & Operation', score: 81 },
  { name: 'IT', score: 76 },
  { name: 'HR', score: 74 },
  { name: 'Marketing', score: 68 },
  { name: 'Business', score: 64 },
];

const BENCHMARK = 80;
const AVG_SCORE = 78;
/** Change in the average score against last year */
const AVG_TREND = 6.2;
/** How many divisions the Top and Needs support tiles pick out */
const GROUP_SIZE = 3;
const AXIS = [0, 25, 50, 75, 100];

const SHORT_INSIGHT = 'Scores are up 6.2% from last year. Business and Marketing may need extra support.';
const INSIGHT_TEXT =
  'Overall division performance is up 6.2% from last year — Data & Analytics and Product lead the way. Business and Marketing may need extra support through workload redistribution or team-building initiatives.';

/**
 * The tiles double as the chart's highlight, like the metric tiles in Program
 * overview: Average shows every division, Top and Needs support light up
 * their three divisions and grey out the rest.
 */
type Group = 'average' | 'top' | 'support';

const TOP = DIVISIONS.slice(0, GROUP_SIZE);
const SUPPORT = DIVISIONS.slice(-GROUP_SIZE);

const TILES: { key: Group; label: string; value: string; note?: string }[] = [
  { key: 'average', label: 'Average score', value: `${AVG_SCORE}%` },
  { key: 'top',     label: 'Top divisions', value: `${TOP.length}`,     note: `${Math.min(...TOP.map((d) => d.score))}% and up` },
  { key: 'support', label: 'Needs support', value: `${SUPPORT.length}`, note: `${Math.max(...SUPPORT.map((d) => d.score))}% and below` },
];

function isHighlighted(group: Group, index: number) {
  if (group === 'top') return index < GROUP_SIZE;
  if (group === 'support') return index >= DIVISIONS.length - GROUP_SIZE;
  return true;
}

// ── Animation ────────────────────────────────────────────────

/** Each bar starts a little after the one above it */
const STAGGER = 0.07;

function DivisionBar({ name, score, index, highlighted, start }: {
  name: string;
  score: number;
  index: number;
  highlighted: boolean;
  start: boolean;
}) {
  const delay = index * STAGGER;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className={cn('whitespace-nowrap text-[12px] transition-colors duration-300', highlighted ? 'text-[#414651]' : 'text-[#A4A7AE]')}>
          {name}
        </span>
        <span className="text-[12px] tabular-nums text-[#A4A7AE]">
          <CountUp value={score} start={start} delay={delay} />%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={HATCHED_TRACK}>
        <motion.div
          className="relative h-full overflow-hidden rounded-full bg-[#E4E6EA]"
          initial={{ width: 0 }}
          animate={{ width: start ? `${score}%` : 0 }}
          transition={{ ...GROW, delay }}
        >
          {/* Blue fill fades out to plain grey when this division is not highlighted */}
          <span
            className={cn('absolute inset-0 transition-opacity duration-300', highlighted ? 'opacity-100' : 'opacity-0')}
            style={{ backgroundImage: `linear-gradient(90deg, ${CHART_BLUE}, #AECBFA)` }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────

export function DashboardDivisionsPerformance({ insight, className }: DashboardDivisionsPerformanceProps) {
  const [group, setGroup] = useState<Group>('average');
  // Bars grow in the first time the chart scrolls into view.
  const chartRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chartRef, { once: true, amount: 0.3 });

  return (
    <div className={cn('relative flex flex-col gap-5 bg-white rounded-[18px] p-5', className)}>
      {/* ── Header ─────────────────────────────────────────── */}
      <CardHeader
        title="Division top performance"
        subtitle={`Self-assessment score vs HR benchmark (${BENCHMARK}%)`}
        icon={Building2}
      />

      {/* ── Summary tiles: also pick what the chart highlights ── */}
      <div className="grid grid-cols-3 gap-3" role="tablist" aria-label="Chart highlight">
        {TILES.map((tile) => {
          const isSelected = tile.key === group;
          return (
            <button
              key={tile.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setGroup(tile.key)}
              className={cn(
                'rounded-[14px] border p-4 text-left transition-colors cursor-pointer',
                isSelected ? 'border-transparent bg-[#1A73E8]/[0.07]' : 'border-[#EDEEF1] hover:bg-[#F9FAFB]',
              )}
            >
              <p className="text-[13px] leading-[18px] text-[#535862]">{tile.label}</p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[24px] leading-[32px] text-[#181D27]">{tile.value}</span>
                {tile.key === 'average' ? (
                  <Trend positive={AVG_TREND >= 0}>{AVG_TREND >= 0 ? '+' : ''}{AVG_TREND}%</Trend>
                ) : (
                  <span className="text-[12px] text-[#717680]">{tile.note}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Chart: one bar per division, benchmark as a dashed line ── */}
      <div ref={chartRef}>
        <div className="relative pt-5">
          <div
            className="pointer-events-none absolute top-0 bottom-0 z-[1] border-l border-dashed border-[#A4A7AE]"
            style={{ left: `${BENCHMARK}%` }}
          >
            <span className="absolute -top-0.5 left-1.5 whitespace-nowrap text-[11px] leading-none text-[#717680]">
              Benchmark {BENCHMARK}%
            </span>
          </div>
          <div className="space-y-3.5">
            {DIVISIONS.map((d, i) => (
              <DivisionBar
                key={d.name}
                name={d.name}
                score={d.score}
                index={i}
                highlighted={isHighlighted(group, i)}
                start={inView}
              />
            ))}
          </div>
        </div>

        {/* X axis: each label sits at its own value */}
        <div className="relative mt-3 h-4">
          {AXIS.map((v, i) => (
            <span
              key={v}
              className={cn(
                'absolute text-[11px] text-[#A4A7AE]',
                i === 0 ? 'left-0' : i === AXIS.length - 1 ? 'right-0' : '-translate-x-1/2',
              )}
              style={i === 0 || i === AXIS.length - 1 ? undefined : { left: `${v}%` }}
            >
              {v}%
            </span>
          ))}
        </div>
      </div>

      {/* ── AI insight: one line ─────────────────────────────── */}
      <AIInsightLine text={SHORT_INSIGHT} fullText={insight ?? INSIGHT_TEXT} />
    </div>
  );
}

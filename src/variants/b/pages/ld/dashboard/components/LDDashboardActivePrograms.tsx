import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { EASE_OUT } from '@/variants/b/motion';
import { BookOpen } from '@/variants/b/icons';
import { cn } from '@/lib/utils';
import type { ProgramOverview } from '../types/dashboard.types';
import { runningPrograms } from '../data/dashboard.mock';
import { daysUntil } from '../period';
import { TruncatedTitle } from './ProgramListParts';
import { ProgramScopeTabs, type ScopeTab } from './ProgramScopeTabs';
import { ATTENTION, CARD, CardHeader, NumText } from '@/variants/b/components/ui/kit';
import { OB_COLORS } from '@/variants/b/theme';

interface LDDashboardActiveProgramsProps {
  programs: ProgramOverview[];
  className?: string;
}

type Filter = 'all' | 'attention' | 'ending';

// Same segmented control as the other cards (its tabs no longer draw icons).
// The type shows in each row (Course · …, Journey · …), so no type tabs.
const FILTERS: ScopeTab<Filter>[] = [
  { key: 'all',       label: 'All',             icon: BookOpen },
  { key: 'attention', label: 'Needs attention', icon: BookOpen },
  { key: 'ending',    label: 'Ending soon',     icon: BookOpen },
];

/** How many programs the card shows; "See all" opens the full list */
const VISIBLE = 5;
/** "Ending soon" = ends within this many days */
const ENDING_SOON_DAYS = 14;
/** Journeys without a module count in the data */
const DEFAULT_MODULES = 5;

/** Attention orange for programs that need attention */
const ATTN = ATTENTION;

const AVATAR_INITIALS = ['AR', 'BS', 'DH', 'RK', 'MP', 'LN', 'YT', 'JW', 'SC', 'EP', 'KD', 'TM'];
// No green: green is kept for positive trends
const AVATAR_COLORS = [OB_COLORS.primary100, OB_COLORS.primary50, OB_COLORS.avatarLilac, OB_COLORS.avatarPeach, OB_COLORS.avatarPink, OB_COLORS.avatarCyan];

function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function modulesOf(p: ProgramOverview) {
  const total = p.modules ?? DEFAULT_MODULES;
  return { total, done: Math.round((p.completionRate / 100) * total) };
}

/** Two small initials avatars, then "+N" for the rest of the enrolled trainees */
function AvatarStack({ program }: { program: ProgramOverview }) {
  const seed = Number(program.id) || 0;
  const shown = Math.min(2, program.participants);
  return (
    <div className="flex shrink-0 items-center gap-1.5" title={`${program.participants} enrolled trainees`}>
      <div className="flex -space-x-1.5">
        {Array.from({ length: shown }, (_, i) => (
          <span
            key={i}
            className="flex size-6 items-center justify-center rounded-full text-[10px] text-(--ob-text-body) ring-2 ring-(--ob-white)"
            style={{ background: AVATAR_COLORS[(seed + i) % AVATAR_COLORS.length] }}
          >
            {AVATAR_INITIALS[(seed * 2 + i) % AVATAR_INITIALS.length]}
          </span>
        ))}
      </div>
      {program.participants > shown && (
        <span className="ob-num text-[12px] text-(--ob-text-muted)">+{program.participants - shown}</span>
      )}
    </div>
  );
}

/** Course: one percentage bar. Journey: one segment per module. 4px tall, 2px corners. */
function ProgramProgress({ program }: { program: ProgramOverview }) {
  if (program.kind === 'journey') {
    const { total, done } = modulesOf(program);
    return (
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-[2px] bg-(--ob-border-strong)">
            {/* Finished modules fill in one after another */}
            {i < done && (
              <motion.span
                className="block h-full origin-left rounded-[2px] bg-(--ob-primary)"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 + i * 0.08 }}
              />
            )}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className={cn('h-1 w-full overflow-hidden rounded-[2px]', program.risk ? ATTN.track : 'bg-(--ob-border-strong)')}>
      <motion.div
        className="h-full rounded-[2px]"
        style={{ background: program.risk ? ATTN.bar : OB_COLORS.primary }}
        initial={{ width: 0 }}
        animate={{ width: `${program.completionRate}%` }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
      />
    </div>
  );
}

function ProgramRow({ program }: { program: ProgramOverview }) {
  const atRisk = !!program.risk;
  const isJourney = program.kind === 'journey';
  const { total, done } = modulesOf(program);

  const value = isJourney ? `${done}/${total}` : `${program.completionRate}%`;
  const meta = atRisk
    ? `At risk · ${program.risk}`
    : isJourney
      ? `Journey · ${total} modules`
      : program.endsOn
        ? `Course · ends ${shortDate(program.endsOn)}`
        : `Course · ${program.duration ?? program.mode}`;

  // Plain row, no lines: the rows are split by space alone
  return (
    <div className="flex py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <TruncatedTitle text={program.name} className="min-w-0 flex-1 text-[13px] leading-[20px] text-(--ob-text-strong)" />
          <span className={cn('ob-num shrink-0 text-[13px]', atRisk ? ATTN.text : 'text-(--ob-text-body)')}>{value}</span>
        </div>
        <div className="mt-0.5 flex min-h-6 items-center justify-between gap-3">
          <p className={cn('truncate text-[12px]', atRisk ? ATTN.text : 'text-(--ob-text-muted)')}>{meta}</p>
          {!atRisk && <AvatarStack program={program} />}
        </div>
        <div className="mt-2">
          <ProgramProgress program={program} />
        </div>
      </div>
    </div>
  );
}

export function LDDashboardActivePrograms({ programs, className }: LDDashboardActiveProgramsProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  // Same rule as the Active programs KPI, so the two always agree
  const active = useMemo(() => runningPrograms(programs), [programs]);
  const atRiskCount = active.filter((p) => p.risk).length;

  const visible = useMemo(() => {
    const list = active.filter((p) => {
      if (filter === 'attention') return !!p.risk;
      if (filter === 'ending') {
        if (!p.endsOn) return false;
        const days = daysUntil(p.endsOn);
        return days >= 0 && days <= ENDING_SOON_DAYS;
      }
      return true;
    });
    return list.slice(0, VISIBLE);
  }, [active, filter]);

  return (
    <div className={cn(CARD, 'relative p-5', className)}>
      <CardHeader
        title="Active programs"
        subtitle={<NumText>{`${active.length} running${atRiskCount ? ` · ${atRiskCount} ${atRiskCount === 1 ? 'needs' : 'need'} attention` : ''}`}</NumText>}
        className="items-center"
        extra={
          <button
            type="button"
            onClick={() => navigate('/ld/learning-management/courses')}
            className="text-[13px] text-(--ob-primary) transition-colors hover:text-(--ob-primary-strong) cursor-pointer"
          >
            See all
          </button>
        }
      />

      {/* Filter: underline tabs, like the other cards */}
      <ProgramScopeTabs id="active-programs-filter" value={filter} onChange={setFilter} tabs={FILTERS} stretch className="mt-5" />

      {/* Program list */}
      {/* Rows slide into place when the filter changes */}
      <div className="mt-2 flex flex-col">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.length === 0 ? (
            <motion.p
              key="empty"
              className="py-8 text-center text-[13px] text-(--ob-text-muted)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No programs here right now.
            </motion.p>
          ) : (
            visible.map((program, i) => (
              <motion.div
                key={program.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE_OUT, delay: i * 0.04 }}
              >
                <ProgramRow program={program} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

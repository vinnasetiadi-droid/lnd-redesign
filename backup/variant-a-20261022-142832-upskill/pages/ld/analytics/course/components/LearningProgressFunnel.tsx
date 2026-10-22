import { cn } from '@/lib/utils';
import { CardHeader, Chip } from '@/variants/a/components/ui/kit';
import { motion } from 'motion/react';
import { FadeValue } from '@/variants/a/pages/ld/dashboard/components/ProgramScopeTabs';
import { Users, PlayCircle, CheckCircle2, TrendingDown, ChevronDown, UserCheck, LogOut, ArrowUpRight, ArrowDownRight } from '@/variants/a/icons';

type ProgramType = 'course' | 'journey';

const STAGE_STYLES = [
  { key: 'enrolled',  label: 'Enrolled',  color: '#1A73E8', lightText: 'text-[#1A73E8]', iconBg: 'bg-[#1A73E8]', borderColor: 'border-[#D2E3FC]', bgColor: 'bg-[#E8F0FE]/40', icon: Users },
  { key: 'started',   label: 'Started',   color: '#8AB4F8', lightText: 'text-[#1967D2]', iconBg: 'bg-[#8AB4F8]', borderColor: 'border-[#E8F0FE]', bgColor: 'bg-[#F5F9FE]/40', icon: PlayCircle },
  { key: 'completed', label: 'Completed', color: '#669DF6', lightText: 'text-[#1967D2]', iconBg: 'bg-[#669DF6]', borderColor: 'border-[#AECBFA]', bgColor: 'bg-[#E8F0FE]/40', icon: CheckCircle2 },
];

// Journeys enrol more learners per program, with a slightly lower finish rate
const FUNNEL_BY_TYPE: Record<ProgramType, {
  counts: [number, number, number];
  percents: [number, number, number];
  startRate: number;
  ofStarted: number;
  completion: number;
  dropOff: number;
  enrollmentRate: { pct: number; enrolled: number; eligible: number; change: string };
  dropOffRate: { pct: number; dropped: number; enrolled: number; change: string };
}> = {
  course: {
    counts: [120, 100, 72],
    percents: [100, 83, 72],
    startRate: 83,
    ofStarted: 72,
    completion: 60,
    dropOff: 28,
    enrollmentRate: { pct: 73, enrolled: 548, eligible: 750, change: '+6%' },
    dropOffRate: { pct: 18, dropped: 99, enrolled: 548, change: '-3%' },
  },
  journey: {
    counts: [160, 128, 102],
    percents: [100, 80, 64],
    startRate: 80,
    ofStarted: 80,
    completion: 64,
    dropOff: 20,
    enrollmentRate: { pct: 76, enrolled: 486, eligible: 640, change: '+4%' },
    dropOffRate: { pct: 22, dropped: 107, enrolled: 486, change: '-1%' },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

// SVG labels can't hold a FadeValue span, so the <text> itself is keyed and faded
const svgTextFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
};

interface LearningProgressFunnelProps {
  programType: ProgramType;
  className?: string;
}

export function LearningProgressFunnel({ programType, className }: LearningProgressFunnelProps) {
  const funnel = FUNNEL_BY_TYPE[programType];
  const [enrolled, started, completed] = funnel.counts;

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'rounded-[18px] bg-white p-5 overflow-hidden relative flex flex-col',
        className
      )}
    >
      {/* Header */}
      <CardHeader
        title="Learning Progress Funnel"
        subtitle="Learner journey from enrollment to completion"
        icon={TrendingDown}
        extra={
          <Chip tone="blue" icon={Users}>
            <FadeValue k={enrolled}>{enrolled} learners</FadeValue>
          </Chip>
        }
        className="mb-5"
      />

      {/* Funnel Visual: SVG + Detail Cards */}
      <div className="flex flex-col md:flex-row gap-5 flex-1">
        {/* SVG Funnel */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-full max-w-[360px]">
            <svg viewBox="0 0 400 270" className="w-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id="funnelShadow" x="-5%" y="-5%" width="110%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
                </filter>
              </defs>

              {/* Stage 1: Enrolled — widest */}
              <g filter="url(#funnelShadow)">
                <path d="M 15,6 L 385,6 L 358,66 L 42,66 Z" fill="#1A73E8" opacity="0.95" />
                <text x="200" y="30" textAnchor="middle" fill="white" fontSize="11" fontWeight="400" fontFamily="DM Sans, sans-serif">Enrolled</text>
                <motion.text key={`${programType}-y52`} {...svgTextFade} x="200" y="52" textAnchor="middle" fill="white" fontSize="17" fontWeight="400" fontFamily="DM Sans, sans-serif">{enrolled}</motion.text>
              </g>

              {/* Connector 1→2 */}
              <g>
                <rect x="155" y="72" width="90" height="18" rx="9" fill="#F5F6F8" />
                <motion.text key={`${programType}-y85`} {...svgTextFade} x="200" y="85" textAnchor="middle" fill="#535862" fontSize="8.5" fontWeight="400" fontFamily="DM Sans, sans-serif">{funnel.startRate}% conversion</motion.text>
              </g>

              {/* Stage 2: Started — medium */}
              <g filter="url(#funnelShadow)">
                <path d="M 52,96 L 348,96 L 325,156 L 75,156 Z" fill="#8AB4F8" opacity="0.95" />
                <text x="200" y="120" textAnchor="middle" fill="white" fontSize="11" fontWeight="400" fontFamily="DM Sans, sans-serif">Started</text>
                <motion.text key={`${programType}-y143`} {...svgTextFade} x="200" y="143" textAnchor="middle" fill="white" fontSize="17" fontWeight="400" fontFamily="DM Sans, sans-serif">{started}</motion.text>
              </g>

              {/* Drop-off callout */}
              <g>
                <rect x="120" y="162" width="160" height="18" rx="9" fill="#FEF3F2" stroke="#FDA29B" strokeWidth="0.5" />
                <motion.text key={`${programType}-y175`} {...svgTextFade} x="200" y="175" textAnchor="middle" fill="#D92D20" fontSize="8.5" fontWeight="400" fontFamily="DM Sans, sans-serif">↓ Drop-off: {funnel.dropOff}% · {started - completed} learners</motion.text>
              </g>

              {/* Stage 3: Completed — narrowest */}
              <g filter="url(#funnelShadow)">
                <path d="M 90,186 L 310,186 L 292,246 L 108,246 Z" fill="#669DF6" opacity="0.95" />
                <text x="200" y="210" textAnchor="middle" fill="white" fontSize="11" fontWeight="400" fontFamily="DM Sans, sans-serif">Completed</text>
                <motion.text key={`${programType}-y233`} {...svgTextFade} x="200" y="233" textAnchor="middle" fill="white" fontSize="17" fontWeight="400" fontFamily="DM Sans, sans-serif">{completed}</motion.text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right side: Stage detail cards */}
        <div className="md:w-[220px] shrink-0 flex flex-col gap-3 justify-center">
          {STAGE_STYLES.map((stage, idx) => {
            const Icon = stage.icon;
            const conversionLabel =
              idx === 0 ? '100% base' :
              idx === 1 ? `${funnel.startRate}% of enrolled` :
              `${funnel.ofStarted}% of started`;
            return (
              <div
                key={stage.key}
                className={cn(
                  'relative p-3.5 rounded-[14px] border transition-all hover:shadow-sm',
                  stage.borderColor, stage.bgColor
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn('size-8 rounded-full flex items-center justify-center shrink-0', stage.iconBg)}>
                    <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <p className="text-[11px] text-[#181D27]">{stage.label}</p>
                      <p className={cn('text-[14px]', stage.lightText)}><FadeValue k={funnel.counts[idx]}>{funnel.counts[idx]}</FadeValue></p>
                    </div>
                    <p className="text-[11px] text-[#A4A7AE] mt-0.5"><FadeValue k={conversionLabel}>{conversionLabel}</FadeValue></p>
                  </div>
                </div>
                {/* Mini bar */}
                <div className="mt-2 w-full bg-white/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${funnel.percents[idx]}%`, backgroundColor: stage.color }}
                  />
                </div>
                {idx < 2 && (
                  <div className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 z-10">
                    <ChevronDown className="w-4 h-4 text-[#D0D5DD]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom summary with Enrollment Rate & Drop-off Rate */}
      <div className="mt-4 pt-3.5 border-t border-[#EDEEF1]">
        {/* Enrollment Rate & Drop-off Rate KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[#F5F9FE]">
            <div className="p-2 rounded-full bg-white text-[#1A73E8] shrink-0">
              <UserCheck className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[#A4A7AE]">Enrollment Rate</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-[16px] text-[#181D27]"><FadeValue k={funnel.enrollmentRate.pct}>{funnel.enrollmentRate.pct}%</FadeValue></span>
                <span className="text-[11px] text-[#A4A7AE]"><FadeValue k={programType}>{funnel.enrollmentRate.enrolled} / {funnel.enrollmentRate.eligible}</FadeValue></span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-[12px] text-[#039855] shrink-0">
              <ArrowUpRight className="w-3 h-3" />
              <FadeValue k={funnel.enrollmentRate.change}>{funnel.enrollmentRate.change}</FadeValue>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[#FEF3F2]/70">
            <div className="p-2 rounded-full bg-white text-[#D92D20] shrink-0">
              <LogOut className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[#A4A7AE]">Drop-off Rate</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-[16px] text-[#181D27]"><FadeValue k={funnel.dropOffRate.pct}>{funnel.dropOffRate.pct}%</FadeValue></span>
                <span className="text-[11px] text-[#A4A7AE]"><FadeValue k={programType}>{funnel.dropOffRate.dropped} / {funnel.dropOffRate.enrolled}</FadeValue></span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-[12px] text-[#039855] shrink-0">
              <ArrowDownRight className="w-3 h-3" />
              <FadeValue k={funnel.dropOffRate.change}>{funnel.dropOffRate.change}</FadeValue>
            </div>
          </div>
        </div>

        {/* Funnel stats */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: 'Total Enrolled', value: `${enrolled}`, color: 'text-[#181D27]' },
            { label: 'Start Rate', value: `${funnel.startRate}%`, color: 'text-[#1A73E8]' },
            { label: 'Completion', value: `${funnel.completion}%`, color: 'text-[#1967D2]' },
            { label: 'Drop-off', value: `${funnel.dropOff}%`, color: 'text-[#D92D20]', highlight: true },
          ].map((stat) => (
            <div key={stat.label} className={cn('text-center p-2.5 rounded-[14px]', stat.highlight ? 'bg-[#FEF3F2]/80' : 'bg-[#F9FAFB]/80')}>
              <p className={cn('text-[14px]', stat.color)}><FadeValue k={stat.value}>{stat.value}</FadeValue></p>
              <p className="text-[11px] text-[#A4A7AE]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

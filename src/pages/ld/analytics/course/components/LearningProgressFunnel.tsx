import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { FadeValue } from '@/pages/ld/dashboard/components/ProgramScopeTabs';
import { Users, PlayCircle, CheckCircle2, TrendingDown, ChevronDown, UserCheck, LogOut, ArrowUpRight, ArrowDownRight } from 'lucide-react';

type ProgramType = 'course' | 'journey';

const STAGE_STYLES = [
  { key: 'enrolled',  label: 'Enrolled',  color: '#1570EF', lightText: 'text-[#1570EF]', iconBg: 'bg-[#1570EF]', borderColor: 'border-[#D1E9FF]', bgColor: 'bg-[#EFF8FF]/40', icon: Users },
  { key: 'started',   label: 'Started',   color: '#2DD4BF', lightText: 'text-[#0D9488]', iconBg: 'bg-[#2DD4BF]', borderColor: 'border-[#CCFBF1]', bgColor: 'bg-[#F0FDFA]/40', icon: PlayCircle },
  { key: 'completed', label: 'Completed', color: '#53B1FD', lightText: 'text-[#175CD3]', iconBg: 'bg-[#53B1FD]', borderColor: 'border-[#B2DDFF]', bgColor: 'bg-[#EFF8FF]/40', icon: CheckCircle2 },
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
        'rounded-[12px] bg-white border border-[#E9EAEB] shadow-[0_1px_3px_rgba(16,24,40,0.06)] p-5 overflow-hidden relative flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[10px] border border-[#E9EAEB] bg-white flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6 text-[#1570EF]" strokeWidth={2} />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[#181D27] tracking-tight">
              Learning Progress Funnel
            </h3>
            <p className="text-[12px] text-[#717680]">
              Learner journey from enrollment to completion
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#EFF8FF] px-3 py-1.5 rounded-xl">
          <Users className="w-3.5 h-3.5 text-[#1570EF]" />
          <span className="text-xs font-medium text-[#175CD3]"><FadeValue k={enrolled}>{enrolled} learners</FadeValue></span>
        </div>
      </div>

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
                <path d="M 15,6 L 385,6 L 358,66 L 42,66 Z" fill="#1570EF" opacity="0.95" />
                <text x="200" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="500" fontFamily="Poppins, sans-serif">Enrolled</text>
                <motion.text key={`${programType}-y52`} {...svgTextFade} x="200" y="52" textAnchor="middle" fill="white" fontSize="17" fontWeight="600" fontFamily="Poppins, sans-serif">{enrolled}</motion.text>
              </g>

              {/* Connector 1→2 */}
              <g>
                <rect x="155" y="72" width="90" height="18" rx="9" fill="#F5F5F5" />
                <motion.text key={`${programType}-y85`} {...svgTextFade} x="200" y="85" textAnchor="middle" fill="#535862" fontSize="8.5" fontWeight="500" fontFamily="Poppins, sans-serif">{funnel.startRate}% conversion</motion.text>
              </g>

              {/* Stage 2: Started — medium */}
              <g filter="url(#funnelShadow)">
                <path d="M 52,96 L 348,96 L 325,156 L 75,156 Z" fill="#2DD4BF" opacity="0.95" />
                <text x="200" y="120" textAnchor="middle" fill="white" fontSize="12" fontWeight="500" fontFamily="Poppins, sans-serif">Started</text>
                <motion.text key={`${programType}-y143`} {...svgTextFade} x="200" y="143" textAnchor="middle" fill="white" fontSize="17" fontWeight="600" fontFamily="Poppins, sans-serif">{started}</motion.text>
              </g>

              {/* Drop-off callout */}
              <g>
                <rect x="120" y="162" width="160" height="18" rx="9" fill="#FEF3F2" stroke="#FDA29B" strokeWidth="0.5" />
                <motion.text key={`${programType}-y175`} {...svgTextFade} x="200" y="175" textAnchor="middle" fill="#D92D20" fontSize="8.5" fontWeight="500" fontFamily="Poppins, sans-serif">↓ Drop-off: {funnel.dropOff}% · {started - completed} learners</motion.text>
              </g>

              {/* Stage 3: Completed — narrowest */}
              <g filter="url(#funnelShadow)">
                <path d="M 90,186 L 310,186 L 292,246 L 108,246 Z" fill="#53B1FD" opacity="0.95" />
                <text x="200" y="210" textAnchor="middle" fill="white" fontSize="12" fontWeight="500" fontFamily="Poppins, sans-serif">Completed</text>
                <motion.text key={`${programType}-y233`} {...svgTextFade} x="200" y="233" textAnchor="middle" fill="white" fontSize="17" fontWeight="600" fontFamily="Poppins, sans-serif">{completed}</motion.text>
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
                  'relative p-3.5 rounded-2xl border transition-all hover:shadow-sm',
                  stage.borderColor, stage.bgColor
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', stage.iconBg)}>
                    <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <p className="text-[11px] font-medium text-[#181D27]">{stage.label}</p>
                      <p className={cn('text-base font-semibold tracking-tight', stage.lightText)}><FadeValue k={funnel.counts[idx]}>{funnel.counts[idx]}</FadeValue></p>
                    </div>
                    <p className="text-[9px] font-medium text-[#A4A7AE] mt-0.5"><FadeValue k={conversionLabel}>{conversionLabel}</FadeValue></p>
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
                    <ChevronDown className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom summary with Enrollment Rate & Drop-off Rate */}
      <div className="mt-4 pt-3.5 border-t border-[#E9EAEB]">
        {/* Enrollment Rate & Drop-off Rate KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EFF8FF]/60 border border-[#D1E9FF]">
            <div className="p-2 rounded-xl bg-white border border-[#E9EAEB] text-[#1570EF] shrink-0">
              <UserCheck className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-medium text-[#A4A7AE] uppercase tracking-widest">Enrollment Rate</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-semibold text-[#181D27]"><FadeValue k={funnel.enrollmentRate.pct}>{funnel.enrollmentRate.pct}%</FadeValue></span>
                <span className="text-[10px] font-medium text-[#A4A7AE]"><FadeValue k={programType}>{funnel.enrollmentRate.enrolled} / {funnel.enrollmentRate.eligible}</FadeValue></span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] font-medium text-[#027A48] bg-[#D1FADF] px-1.5 py-0.5 rounded-[4px] shrink-0">
              <ArrowUpRight className="w-3 h-3" />
              <FadeValue k={funnel.enrollmentRate.change}>{funnel.enrollmentRate.change}</FadeValue>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50/60 border border-rose-100">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
              <LogOut className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-medium text-[#A4A7AE] uppercase tracking-widest">Drop-off Rate</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-semibold text-[#181D27]"><FadeValue k={funnel.dropOffRate.pct}>{funnel.dropOffRate.pct}%</FadeValue></span>
                <span className="text-[10px] font-medium text-[#A4A7AE]"><FadeValue k={programType}>{funnel.dropOffRate.dropped} / {funnel.dropOffRate.enrolled}</FadeValue></span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-[10px] font-medium text-[#027A48] bg-[#D1FADF] px-1.5 py-0.5 rounded-[4px] shrink-0">
              <ArrowDownRight className="w-3 h-3" />
              <FadeValue k={funnel.dropOffRate.change}>{funnel.dropOffRate.change}</FadeValue>
            </div>
          </div>
        </div>

        {/* Funnel stats */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: 'Total Enrolled', value: `${enrolled}`, color: 'text-[#181D27]' },
            { label: 'Start Rate', value: `${funnel.startRate}%`, color: 'text-[#1570EF]' },
            { label: 'Completion', value: `${funnel.completion}%`, color: 'text-[#0D9488]' },
            { label: 'Drop-off', value: `${funnel.dropOff}%`, color: 'text-rose-600', highlight: true },
          ].map((stat) => (
            <div key={stat.label} className={cn('text-center p-2.5 rounded-xl', stat.highlight ? 'bg-rose-50/80' : 'bg-gray-50/80')}>
              <p className={cn('text-base font-semibold', stat.color)}><FadeValue k={stat.value}>{stat.value}</FadeValue></p>
              <p className="text-[9px] font-medium text-[#A4A7AE] uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

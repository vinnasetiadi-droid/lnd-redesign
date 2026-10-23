import { useId, useMemo, useRef, type ReactNode } from 'react';
import { useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { OD_COLORS } from '@/variants/d/theme';

/**
 * Option D chart styling, after the clean references: folded gradient bars with
 * thin diagonal stripes, thin lines without dots (dashed for comparison series),
 * soft area fills, dashed horizontal grid only, white tooltip cards, and
 * gradient progress bars on a hatched track.
 *
 * Recharts only renders plain SVG children (like <defs>) inside a chart, so the
 * defs here are functions that return elements, not components.
 */

export const CHART_BLUE = OD_COLORS.primary;

/** Axis tick text */
export const AXIS_TICK = { fill: OD_COLORS.textSubtle, fontSize: 11 };

/** Spread onto <CartesianGrid /> */
export const GRID_PROPS = { strokeDasharray: '4 4', stroke: OD_COLORS.border, vertical: false } as const;

/** Unique SVG ids, since several charts share the page */
export function useChartIds(prefix: string) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return useMemo(() => ({
    barGradient: `${prefix}-bar-${id}`,
    barSelected: `${prefix}-bar-selected-${id}`,
    fold: `${prefix}-fold-${id}`,
    column: `${prefix}-column-${id}`,
    stripes: `${prefix}-stripes-${id}`,
    area: `${prefix}-area-${id}`,
  }), [prefix, id]);
}

/** <linearGradient> for the soft fill under a line */
export function areaGradient(id: string, color = CHART_BLUE, opacity = 0.18) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={opacity} />
      <stop offset="100%" stopColor={color} stopOpacity={0} />
    </linearGradient>
  );
}

export interface TooltipRow {
  label: string;
  value: ReactNode;
  color: string;
  /** Line series: a short line marker instead of a square */
  line?: boolean;
  dashed?: boolean;
}

/** White tooltip card used by every chart */
export function ChartTooltipCard({ title, rows }: { title?: ReactNode; rows: TooltipRow[] }) {
  return (
    <div className="min-w-[168px] rounded-[12px] bg-white px-3.5 py-3 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]">
      {title && <p className="mb-2 text-[12px] text-(--od-text-muted)">{title}</p>}
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-[12px] text-(--od-text-secondary)">
              <LegendMark color={row.color} line={row.line} dashed={row.dashed} />
              {row.label}
            </span>
            <span className="text-[13px] text-(--od-text-strong)">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Small legend marker: a square for bars and areas, a short line for lines (dashed if the series is) */
export function LegendMark({ color, line, dashed }: { color: string; line?: boolean; dashed?: boolean }) {
  return line || dashed ? (
    <span className={cn('w-3 shrink-0 border-t-2', dashed ? 'border-dashed' : 'border-solid')} style={{ borderColor: color }} />
  ) : (
    <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: color }} />
  );
}

/** Legend row */
export function ChartLegend({ items, className }: { items: TooltipRow[] | Omit<TooltipRow, 'value'>[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-[12px] text-(--od-text-muted)">
          <LegendMark color={item.color} line={item.line} dashed={item.dashed} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Light hatched track behind progress fills */
export const HATCHED_TRACK = {
  backgroundColor: OD_COLORS.surface,
  backgroundImage: `repeating-linear-gradient(135deg, ${OD_COLORS.borderStrong} 0 1px, transparent 1px 6px)`,
} as const;

/** Progress bar: blue gradient fill on a light hatched track */
export function GradientProgress({ value, className, from = CHART_BLUE, to = OD_COLORS.primary200 }: {
  /** 0-100 */
  value: number;
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div
      className={cn('h-2.5 w-full overflow-hidden rounded-full', className)}
      style={HATCHED_TRACK}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
      />
    </div>
  );
}

/** Share of each column the folded bar fills; the rest is its folded side */
export const FOLD_BAR_SHARE = 0.82;

type FoldIds = Pick<ReturnType<typeof useChartIds>, 'barGradient' | 'barSelected' | 'fold' | 'column' | 'stripes'>;

/** <defs> for the folded gradient bars; call inside <defs> */
export function foldBarDefs(ids: FoldIds) {
  return (
    <>
      {/* Bar: strong blue at the top, almost white at the base */}
      <linearGradient id={ids.barGradient} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.95} />
        <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.06} />
      </linearGradient>
      {/* Selected bar: solid, no stripes */}
      <linearGradient id={ids.barSelected} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={1} />
        <stop offset="100%" stopColor={OD_COLORS.primary300} stopOpacity={0.55} />
      </linearGradient>
      {/* The lighter side that folds down to the next column */}
      <linearGradient id={ids.fold} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={OD_COLORS.primary300} stopOpacity={0.8} />
        <stop offset="100%" stopColor={OD_COLORS.primary100} stopOpacity={0.08} />
      </linearGradient>
      {/* Glow behind the selected column */}
      <linearGradient id={ids.column} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={OD_COLORS.primary100} stopOpacity={0.9} />
        <stop offset="100%" stopColor={OD_COLORS.primary50} stopOpacity={0} />
      </linearGradient>
      <pattern id={ids.stripes} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="9" stroke={OD_COLORS.white} strokeWidth="1.5" strokeOpacity="0.75" />
      </pattern>
    </>
  );
}

/**
 * Bar `shape` for a chart with barCategoryGap={0}: each column holds a
 * gradient bar with white stripes and a lighter side folding down to the next
 * column, split from it by a thin line. The selected column gets a solid bar
 * and a glow from the top.
 */
export function foldBar(ids: FoldIds, isSelected: (index: number) => boolean) {
  return function FoldBar(props: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    index?: number;
    background?: { x: number; y: number; width: number; height: number };
  }) {
    const { x = 0, y = 0, width = 0, height = 0, index = -1, background } = props;
    if (width <= 0) return <g />;
    const on = isSelected(index);
    const base = y + height;
    const top = background?.y ?? y;
    const bottom = background ? background.y + background.height : base;
    const barW = Math.max(2, width * FOLD_BAR_SHARE);
    const fold = width - barW;
    return (
      <g style={{ cursor: 'pointer' }}>
        {on && <rect x={x} y={top} width={width} height={bottom - top} fill={`url(#${ids.column})`} />}
        {index > 0 && <line x1={x} x2={x} y1={top} y2={bottom} stroke={OD_COLORS.border} />}
        {height > 0 && (
          <>
            <polygon
              points={`${x + barW},${y} ${x + width},${y + Math.min(height, fold * 1.8)} ${x + width},${base} ${x + barW},${base}`}
              fill={`url(#${ids.fold})`}
            />
            <rect x={x} y={y} width={barW} height={height} fill={`url(#${on ? ids.barSelected : ids.barGradient})`} />
            {!on && <rect x={x} y={y} width={barW} height={height} fill={`url(#${ids.stripes})`} />}
            <rect x={x} y={y} width={barW} height={1.5} fill={CHART_BLUE} />
          </>
        )}
      </g>
    );
  };
}

/**
 * `LabelList content`: a quiet value pill above the selected bar (34px tall,
 * 13px text, light blue tint). At either end it lines up with the bar's outer
 * edge so it stays inside the chart.
 */
export function pillLabel(
  selected: number,
  count: number,
  format: (value: number | string) => string,
  /** Share of the column the bar fills (foldBar: 0.82), to centre the pill on the bar */
  barShare = 1,
) {
  return function PillLabel(props: { x?: number | string; y?: number | string; width?: number | string; value?: number | string; index?: number }) {
    if (props.index !== selected) return null;
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const width = Number(props.width ?? 0);
    const text = format(props.value ?? '');
    const w = text.length * 6.8 + 20;
    const left =
      props.index === count - 1 ? x + width - w
      : props.index === 0 ? x
      : x + (width * barShare) / 2 - w / 2;
    return (
      <g pointerEvents="none">
        <rect x={left} y={y - 44} width={w} height={34} rx={17} fill={OD_COLORS.primary50} />
        <text x={left + w / 2} y={y - 22.5} textAnchor="middle" fill={OD_COLORS.primaryStrong} fontSize={13} fontFamily="DM Sans, sans-serif">
          {text}
        </text>
      </g>
    );
  };
}

/**
 * Mounts a chart only once its box scrolls into view, so recharts' draw-in
 * animation plays where people can see it. Keeps the height in the meantime.
 */
export function ChartOnView({ height, children, className }: { height: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className={cn('w-full min-w-0', className)} style={{ height }}>
      {inView ? children : null}
    </div>
  );
}

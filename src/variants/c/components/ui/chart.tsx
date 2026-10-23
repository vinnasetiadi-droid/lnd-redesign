import { useId, useMemo, useRef, type ReactNode } from 'react';
import { useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { OC_COLORS } from '@/variants/c/theme';

/**
 * Option C chart styling, after the user's references (AI Search Visibility,
 * Monthly recurring revenue): stepped columns that touch, each a 2px blue top
 * line over a fill fading downwards, the picked one stronger with a black value
 * pill above it; stepped areas for lines; faint solid horizontal grid lines, white tooltip cards, and plain
 * progress bars with 3px corners.
 *
 * Recharts only renders plain SVG children (like <defs>) inside a chart, so the
 * defs here are functions that return elements, not components.
 */

export const CHART_BLUE = OC_COLORS.primary;

/** Axis tick text */
export const AXIS_TICK = { fill: OC_COLORS.textSubtle, fontSize: 11 };

/** Spread onto <CartesianGrid />: faint solid horizontal lines only */
export const GRID_PROPS = { stroke: OC_COLORS.border, vertical: false } as const;

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

/** Tooltip card used by every chart: black with white text, like the value pill on the bars (raised navy with a hairline in dark) */
export function ChartTooltipCard({ title, rows }: { title?: ReactNode; rows: TooltipRow[] }) {
  return (
    <div className="min-w-[168px] rounded-(--oc-radius-control) bg-(--oc-tooltip) px-3.5 py-3 shadow-(--oc-shadow-tooltip) ring-1 ring-(--oc-tooltip-ring)">
      {title && <p className="mb-2 text-[12px] text-(--oc-on-ink)/60">{title}</p>}
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-[12px] text-(--oc-on-ink)/75">
              <LegendMark color={row.color} line={row.line} dashed={row.dashed} />
              {row.label}
            </span>
            <span className="text-[13px] text-(--oc-on-ink)">{row.value}</span>
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
        <span key={item.label} className="flex items-center gap-1.5 text-[12px] text-(--oc-text-muted)">
          <LegendMark color={item.color} line={item.line} dashed={item.dashed} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Plain light track behind progress fills (the name is from when it was hatched) */
export const HATCHED_TRACK = {
  backgroundColor: OC_COLORS.surface,
} as const;

/** Progress bar: blue gradient fill on a light track, 3px corners */
export function GradientProgress({ value, className, from = CHART_BLUE, to = OC_COLORS.progressEnd }: {
  /** 0-100 */
  value: number;
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div
      className={cn('h-2.5 w-full overflow-hidden rounded-(--oc-radius-bar)', className)}
      style={HATCHED_TRACK}
    >
      <div
        className="h-full rounded-(--oc-radius-bar) transition-[width] duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
      />
    </div>
  );
}

/** The columns fill their whole category, so labels centre on the whole column */
export const FOLD_BAR_SHARE = 1;

type FoldIds = Pick<ReturnType<typeof useChartIds>, 'barGradient' | 'barSelected' | 'fold' | 'column' | 'stripes'>;

/** <defs> for the stepped columns: a blue fill that fades out downwards, stronger on the picked month */
export function foldBarDefs(ids: FoldIds) {
  return (
    <>
      <linearGradient id={ids.barGradient} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.3} />
        <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0} />
      </linearGradient>
      <linearGradient id={ids.barSelected} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.6} />
        <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.04} />
      </linearGradient>
    </>
  );
}

/**
 * Bar `shape` for a chart with barCategoryGap={0}, after the AI Search
 * Visibility reference: columns that touch, each a flat 2px blue line on top
 * with a fill fading out downwards. The right side slopes out a little over
 * the next column (not on the last one, so it stays inside the chart). The
 * picked month has the stronger fill. The whole column is clickable.
 */
export function foldBar(ids: FoldIds, isSelected: (index: number) => boolean, count = 0) {
  return function StepColumn(props: { x?: number; y?: number; width?: number; height?: number; index?: number }) {
    const { x = 0, y = 0, width = 0, height = 0, index = -1 } = props;
    if (width <= 0) return <g />;
    const on = isSelected(index);
    const bottom = y + height;
    const top = Math.min(y, bottom - 1);
    const slant = index === count - 1 ? 0 : width * 0.22;
    const d = `M${x},${bottom} V${top} H${x + width} L${x + width + slant},${bottom} Z`;
    return (
      <g style={{ cursor: 'pointer' }}>
        <rect x={x} y={top} width={width} height={bottom - top} fill="transparent" />
        <path d={d} fill={`url(#${on ? ids.barSelected : ids.barGradient})`} />
        <path d={`M${x + 1},${top} H${x + width - 1}`} stroke={on ? OC_COLORS.primaryStrong : CHART_BLUE} strokeWidth={2} strokeLinecap="round" />
      </g>
    );
  };
}

/**
 * `LabelList content`: a black value pill with white text above the selected
 * bar, with a small pointer (the "1.10 kWh" pill in the reference); in dark a
 * light pill with navy text, so it still stands out. At either
 * end it lines up with the column's outer edge so it stays inside the chart.
 */
export function pillLabel(
  selected: number,
  count: number,
  format: (value: number | string) => string,
  /** Share of the column to centre on (the columns fill it, so 1) */
  barShare = 1,
) {
  return function PillLabel(props: { x?: number | string; y?: number | string; width?: number | string; value?: number | string; index?: number }) {
    if (props.index !== selected) return null;
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const width = Number(props.width ?? 0);
    const text = format(props.value ?? '');
    const w = text.length * 6.6 + 18;
    const centre = x + (width * barShare) / 2;
    const left =
      props.index === count - 1 ? Math.min(centre - w / 2, x + width - w)
      : props.index === 0 ? Math.max(centre - w / 2, x)
      : centre - w / 2;
    const top = y - 36;
    return (
      <g pointerEvents="none">
        <rect x={left} y={top} width={w} height={24} rx={6} fill={OC_COLORS.pill} />
        <path d={`M${centre - 4},${top + 24} L${centre},${top + 28} L${centre + 4},${top + 24} Z`} fill={OC_COLORS.pill} />
        <text x={left + w / 2} y={top + 16} textAnchor="middle" fill={OC_COLORS.pillText} fontSize={12} fontFamily="General Sans, sans-serif">
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

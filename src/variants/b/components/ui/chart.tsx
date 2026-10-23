import { useId, useMemo, useRef, type ReactNode } from 'react';
import { useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { OB_COLORS, OB_NUM_FONT } from '@/variants/b/theme';
import { NumText } from './kit';

/**
 * Option B chart styling, after the clean references: folded gradient bars with
 * thin diagonal stripes, thin lines without dots (dashed for comparison series),
 * soft area fills, dashed horizontal grid only, white tooltip cards, and
 * gradient progress bars on a hatched track.
 *
 * Recharts only renders plain SVG children (like <defs>) inside a chart, so the
 * defs here are functions that return elements, not components.
 */

export const CHART_BLUE = OB_COLORS.primary;

/** Axis tick text (words: months, names) */
export const AXIS_TICK = { fill: OB_COLORS.textSubtle, fontSize: 11 };
/** Axis tick numbers (0, 50, 100%): Geist Mono */
export const NUM_TICK = { ...AXIS_TICK, fontFamily: OB_NUM_FONT };

/** Text and number parts of a label, for SVG: the numbers as Geist Mono <tspan>s */
export function svgNumText(text: string) {
  return text.split(/([+\-−]?\d[\d,.]*%?)/).map((part, i) =>
    i % 2 ? <tspan key={i} fontFamily={OB_NUM_FONT}>{part}</tspan> : part,
  );
}

/** Spread onto <CartesianGrid /> */
export const GRID_PROPS = { strokeDasharray: '4 4', stroke: OB_COLORS.border, vertical: false } as const;

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
    <div className="min-w-[168px] rounded-(--ob-radius-card) bg-(--ob-white) px-3.5 py-3 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]">
      {title && <p className="mb-2 text-[12px] text-(--ob-text-muted)">{title}</p>}
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-[12px] text-(--ob-text-secondary)">
              <LegendMark color={row.color} line={row.line} dashed={row.dashed} />
              {row.label}
            </span>
            <span className="text-[13px] text-(--ob-text-strong)"><NumText>{row.value}</NumText></span>
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
        <span key={item.label} className="flex items-center gap-1.5 text-[12px] text-(--ob-text-muted)">
          <LegendMark color={item.color} line={item.line} dashed={item.dashed} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/** Plain light track behind progress fills (the name is from when it was hatched) */
export const HATCHED_TRACK = {
  backgroundColor: OB_COLORS.surface,
} as const;

/** Progress bar: blue gradient fill on a light track, 4px tall with 2px corners */
export function GradientProgress({ value, className, from = CHART_BLUE, to = OB_COLORS.primary200 }: {
  /** 0-100 */
  value: number;
  className?: string;
  from?: string;
  to?: string;
}) {
  return (
    <div
      className={cn('h-1 w-full overflow-hidden rounded-[2px]', className)}
      style={HATCHED_TRACK}
    >
      <div
        className="h-full rounded-[2px] transition-[width] duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
      />
    </div>
  );
}

/**
 * Kept for the callers that centre labels on the bar: the bar is centred
 * in its column, so the label centres on the whole column.
 */
export const FOLD_BAR_SHARE = 1;

type FoldIds = Pick<ReturnType<typeof useChartIds>, 'barGradient' | 'barSelected' | 'fold' | 'column' | 'stripes'>;

/** <defs> for the column bars; call inside <defs>. `color` is the selected bar's */
export function foldBarDefs(ids: FoldIds, color: string = CHART_BLUE) {
  return (
    <linearGradient id={ids.barSelected} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} />
      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
    </linearGradient>
  );
}

/**
 * Bar `shape` for a chart with barCategoryGap={0}: a bar in the middle of each
 * column with 4px top corners and a square bottom, light grey, and the blue
 * gradient (with a soft glow) for the selected one.
 */
export function foldBar(ids: FoldIds, isSelected: (index: number) => boolean, color: string = CHART_BLUE) {
  const glow = `color-mix(in srgb, ${color} 40%, transparent)`;
  return function PillBar(props: { x?: number; y?: number; width?: number; height?: number; index?: number }) {
    const { x = 0, y = 0, width = 0, height = 0, index = -1 } = props;
    if (width <= 0) return <g />;
    const on = isSelected(index);
    const barW = Math.min(30, Math.max(6, width * 0.56));
    const h = Math.max(height, 6);
    // 4px top corners, square bottom
    const x0 = x + (width - barW) / 2;
    const x1 = x0 + barW;
    const top = y + height - h;
    const bottom = y + height;
    const r = Math.min(4, barW / 2, h);
    const d = `M${x0},${bottom} V${top + r} A${r},${r} 0 0 1 ${x0 + r},${top} H${x1 - r} A${r},${r} 0 0 1 ${x1},${top + r} V${bottom} Z`;
    return (
      <g style={{ cursor: 'pointer' }}>
        {/* Full-height hit area, so the whole column is clickable */}
        <rect x={x} y={y + height - h} width={width} height={h} fill="transparent" />
        <path
          d={d}
          fill={on ? `url(#${ids.barSelected})` : OB_COLORS.buttonSecondary}
          // The selected bar glows a little in its own colour
          style={{ transition: 'fill 300ms ease', filter: on ? `drop-shadow(0 6px 10px ${glow})` : undefined }}
        />
      </g>
    );
  };
}

/**
 * `LabelList content`: the value in plain text above the selected bar. At
 * either end it lines up with the bar's outer edge so it stays inside the chart.
 */
export function pillLabel(
  selected: number,
  count: number,
  format: (value: number | string) => string,
  /** Share of the column to centre on (the bars sit in the middle, so 1) */
  barShare = 1,
) {
  return function PillLabel(props: { x?: number | string; y?: number | string; width?: number | string; value?: number | string; index?: number }) {
    if (props.index !== selected) return null;
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const width = Number(props.width ?? 0);
    const text = format(props.value ?? '');
    // Centred on the bar; the first and last labels shift inwards if they would spill over
    const half = (text.length * 6.4) / 2;
    const centre = x + (width * barShare) / 2;
    const cx =
      props.index === count - 1 ? Math.min(centre, x + width - half)
      : props.index === 0 ? Math.max(centre, x + half)
      : centre;
    return (
      <text x={cx} y={y - 10} textAnchor="middle" fill={OB_COLORS.textStrong} fontSize={12} fontFamily="Inter, sans-serif" pointerEvents="none">
        {svgNumText(text)}
      </text>
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

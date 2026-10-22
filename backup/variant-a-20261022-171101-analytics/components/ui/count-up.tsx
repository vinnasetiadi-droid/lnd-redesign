import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';

/** Same easing as the bars and gauges that grow in */
export const GROW = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

/** Counts from 0 up to `value` once `start` turns true */
export function CountUp({ value, start, delay = 0 }: { value: number; start: boolean; delay?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    if (!start) return;
    const controls = animate(count, value, { ...GROW, delay });
    return () => controls.stop();
  }, [start, value, delay, count]);
  return <motion.span>{rounded}</motion.span>;
}

/**
 * Counts up a display value such as "309", "1,240" or "80%" on first render.
 * Anything that is not a whole number with an optional suffix shows as is.
 */
export function CountUpText({ value, delay = 0.3 }: { value: string; delay?: number }) {
  const match = /^(\d[\d,]*)(\D*)$/.exec(value);
  if (!match) return <>{value}</>;
  const target = Number(match[1].replace(/,/g, ''));
  return (
    <>
      <CountUpGrouped value={target} delay={delay} />
      {match[2]}
    </>
  );
}

/** CountUp with thousands separators */
function CountUpGrouped({ value, delay }: { value: number; delay: number }) {
  const count = useMotionValue(0);
  const text = useTransform(count, (v) => Math.round(v).toLocaleString('en-US'));
  useEffect(() => {
    const controls = animate(count, value, { ...GROW, delay });
    return () => controls.stop();
  }, [value, delay, count]);
  return <motion.span>{text}</motion.span>;
}

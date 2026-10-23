import { useEffect, useRef, useState } from 'react';

/** Room left under a column when it sticks to the bottom of the view */
const STICKY_BOTTOM_GAP = 24;

/** The nearest ancestor that scrolls (the layout's content area, not the window) */
function scrollParentOf(el: HTMLElement | null): HTMLElement | null {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
  }
  return null;
}

/**
 * Sticky top for a column that should always fill its side: it scrolls with
 * the page until its bottom is in view, then holds ("sticky to the bottom");
 * a column shorter than the view sticks right under the top bar (top 0 of the
 * scroll area). Put the ref on an inner `lg:sticky` wrapper inside a
 * full-height grid cell. A column as tall as its row has no room to move, so
 * only the shorter column ever sticks. Recomputed when the column or the
 * scroll area changes size.
 */
export function useStickyColumnTop() {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  useEffect(() => {
    const column = ref.current;
    const scroller = scrollParentOf(column);
    if (!column || !scroller) return;
    const update = () => setTop(Math.min(0, scroller.clientHeight - column.offsetHeight - STICKY_BOTTOM_GAP));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(column);
    ro.observe(scroller);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);
  return { ref, top };
}

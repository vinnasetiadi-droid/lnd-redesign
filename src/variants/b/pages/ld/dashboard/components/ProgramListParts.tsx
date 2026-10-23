// Pieces shared by the dashboard's program lists (Active Programs,
// Recent Program): the Course/Journey label, a one-line title that shows the
// full name on hover when it doesn't fit, and a "Show More" list that keeps
// loading as you scroll.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Loader2 } from '@/variants/b/icons';
import { cn } from '@/lib/utils';
import type { ProgramKind } from '../types/dashboard.types';

// ── Course / Journey label — same colours as Approval Progress ──

const KIND_STYLE: Record<ProgramKind, string> = {
  course: 'bg-(--ob-primary-50) text-(--ob-primary-strong)',
  journey: 'bg-(--ob-surface) text-(--ob-text-body)',
};

export function ProgramKindLabel({ kind }: { kind: ProgramKind }) {
  return (
    <span className={cn('inline-flex h-[30px] items-center rounded-(--ob-radius-control) px-3.5 text-[12px] leading-none shrink-0', KIND_STYLE[kind])}>
      {kind === 'course' ? 'Course' : 'Journey'}
    </span>
  );
}

// ── One-line title, full name in a tooltip when it's cut off ──

/**
 * The tooltip renders into document.body so the card's overflow and the
 * scrolling list can't clip it. It only appears when the title is truncated.
 */
export function TruncatedTitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  // A fixed-position tooltip would drift if the list scrolls under it.
  useEffect(() => {
    if (!anchor) return;
    const hide = () => setAnchor(null);
    window.addEventListener('scroll', hide, true);
    return () => window.removeEventListener('scroll', hide, true);
  }, [anchor]);

  return (
    <>
      <p
        ref={ref}
        onMouseEnter={() => overflowing && ref.current && setAnchor(ref.current.getBoundingClientRect())}
        onMouseLeave={() => setAnchor(null)}
        className={cn('truncate', className)}
      >
        {text}
      </p>
      {anchor && createPortal(
        <motion.div
          role="tooltip"
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed z-[100] max-w-[320px] px-3 py-1.5 rounded-(--ob-radius-control) bg-(--ob-text-ink) text-white text-[12px] leading-[18px] shadow-lg pointer-events-none"
          style={{ left: anchor.left, top: anchor.top - 8, transform: 'translateY(-100%)', fontFamily: "'Inter', sans-serif" }}
        >
          {text}
          <span className="absolute -bottom-1 left-4 w-2 h-2 bg-(--ob-text-ink) rotate-45" aria-hidden />
        </motion.div>,
        document.body,
      )}
    </>
  );
}

// ── Show More → infinite scrolling ───────────────────────────

const LOAD_DELAY_MS = 600;

/**
 * Shows `initial` items until the user asks for more; from then on the list
 * scrolls inside its card and loads `step` more each time the end comes into
 * view.
 */
export function useInfiniteList<T>(items: T[], { initial = 5, step = 5 } = {}) {
  const [expanded, setExpanded] = useState(false);
  const [count, setCount] = useState(initial);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = count < items.length;

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setCount((c) => Math.min(c + step, items.length));
      setLoading(false);
    }, LOAD_DELAY_MS);
  }, [loading, step, items.length]);

  useEffect(() => {
    if (!expanded || !hasMore) return;
    const root = scrollRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { root, rootMargin: '0px 0px 40px 0px' },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [expanded, hasMore, loadMore]);

  const showMore = () => {
    setExpanded(true);
    loadMore();
  };

  const showLess = () => {
    setExpanded(false);
    setCount(initial);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  return {
    visible: items.slice(0, count),
    expanded,
    hasMore,
    loading,
    scrollRef,
    sentinelRef,
    showMore,
    showLess,
  };
}

type InfiniteList = ReturnType<typeof useInfiniteList>;

/**
 * Scroll container: plain list until expanded, then a scrolling panel whose
 * bottom edge fades out while there's more below — so it reads as endless.
 */
export function InfiniteListBody({ list, children, className }: { list: InfiniteList; children: React.ReactNode; className?: string }) {
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = list.scrollRef.current;
    if (!el) return;
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  }, [list.scrollRef]);

  // Re-check whenever items load or the panel opens/closes.
  useEffect(() => { measure(); }, [measure, list.visible.length, list.expanded, list.loading]);

  const showFade = list.expanded && (list.hasMore || !atEnd);

  return (
    <div className="relative">
      <div
        ref={list.scrollRef}
        onScroll={list.expanded ? measure : undefined}
        className={cn(
          className,
          list.expanded && 'max-h-[440px] overflow-y-auto pr-1 -mr-1 pb-6 [scrollbar-width:thin]',
        )}
      >
        {children}
        {list.expanded && list.hasMore && <div ref={list.sentinelRef} className="h-px" aria-hidden />}
        {list.loading && (
          <div className="flex items-center justify-center gap-2 py-3 text-[12px] text-(--ob-text-subtle)">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading more…
          </div>
        )}
      </div>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent transition-opacity duration-300',
          showFade ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}

/** "Show More" before, and "Show less" once the list is scrolling. */
export function InfiniteListFooter({ list, total, noun }: { list: InfiniteList; total: number; noun: string }) {
  if (!list.expanded) {
    if (!list.hasMore) return null;
    return (
      <button
        type="button"
        onClick={list.showMore}
        className="mt-3 w-full h-9 rounded-(--ob-radius-button) bg-(--ob-button-secondary) text-[13px] text-(--ob-text-strong) hover:bg-(--ob-button-secondary-hover) transition-colors cursor-pointer"
      >
        Show more
      </button>
    );
  }
  return (
    <div className="mt-3 flex items-center justify-between text-[12px]">
      <span className="text-(--ob-text-subtle)">
        {list.hasMore ? `Showing ${list.visible.length} of ${total} ${noun}` : `All ${total} ${noun} loaded`}
      </span>
      <button
        type="button"
        onClick={list.showLess}
        className="text-(--ob-primary) hover:text-(--ob-primary-strong) transition-colors cursor-pointer"
      >
        Show less
      </button>
    </div>
  );
}

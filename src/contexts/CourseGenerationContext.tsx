// ============================================================
// CourseGenerationContext — drives the "AI is still writing each
// activity" experience on the Create-Course-with-AI overview.
//
// Generation runs MODULE BY MODULE: the structure appears instantly,
// then each module is generated in turn — the active module is
// highlighted while its activities stream in (skeleton → real), then
// the next module starts. This context owns the clock and exposes:
//   1. per-activity readiness (isReady),
//   2. per-module status (moduleStatus: queued | active | done),
//   3. the current-module summary for the toast/banner.
//
// It lives at the app root so the toast keeps running even if the
// user navigates away from the create page ("keep working").
// ============================================================

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface ModuleGroup {
  moduleId: string;
  title: string;
  activityIds: string[];
}

interface StartOptions {
  groups: ModuleGroup[];
  courseName?: string;
  /** Where "View course" should land the user once generation finishes. */
  resumeHref?: string;
  /** Total wall-clock for the whole course. */
  durationMs?: number;
}

export type ModuleStatus = 'idle' | 'queued' | 'active' | 'done';

interface CourseGenerationContextValue {
  active: boolean;
  done: boolean;
  /** True while generation is still running (active and not finished) — used to lock the UI. */
  locked: boolean;
  courseName: string | null;
  resumeHref?: string;
  /** 0–100 overall progress. */
  progress: number;
  totalModules: number;
  /** 1-based index of the module currently generating (== totalModules when done). */
  currentModuleIndex: number;
  currentModuleTitle: string | null;
  currentModuleActivityCount: number;
  currentModuleReady: number;
  /** True once a given activity has finished generating (or when idle). */
  isReady: (activityId: string) => boolean;
  moduleStatus: (moduleId: string) => ModuleStatus;
  start: (opts: StartOptions) => void;
  dismiss: () => void;
}

const Ctx = createContext<CourseGenerationContextValue | null>(null);

const DEFAULT_DURATION = 60000;
const TICK_MS = 120;

interface Range {
  moduleId: string;
  title: string;
  start: number;
  end: number;
  count: number;
}

export function CourseGenerationProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [courseName, setCourseName] = useState<string | null>(null);
  const [resumeHref, setResumeHref] = useState<string | undefined>(undefined);
  // Single source of truth for the clock; everything else is derived.
  const [elapsed, setElapsed] = useState(0);

  const flatIdsRef = useRef<string[]>([]);
  const rangesRef = useRef<Range[]>([]);
  const perActivityRef = useRef(3000);
  const totalDurRef = useRef(DEFAULT_DURATION);
  const startedAtRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    ({ groups, courseName: name, resumeHref: href, durationMs }: StartOptions) => {
      clearTimer();

      const flat: string[] = [];
      const ranges: Range[] = [];
      let cursor = 0;
      for (const g of groups) {
        const startIdx = cursor;
        for (const id of g.activityIds) flat.push(id);
        cursor += g.activityIds.length;
        ranges.push({
          moduleId: g.moduleId,
          title: g.title,
          start: startIdx,
          end: cursor,
          count: g.activityIds.length,
        });
      }

      const count = flat.length;
      const totalDur = durationMs ?? DEFAULT_DURATION;

      flatIdsRef.current = flat;
      rangesRef.current = ranges;
      perActivityRef.current = count > 0 ? totalDur / count : totalDur;
      totalDurRef.current = totalDur;
      startedAtRef.current = Date.now();

      setCourseName(name ?? null);
      setResumeHref(href);
      setActive(true);
      setDone(false);
      setElapsed(0);

      intervalRef.current = setInterval(() => {
        const e = Date.now() - startedAtRef.current;
        if (e >= totalDur) {
          clearTimer();
          setElapsed(totalDur);
          setDone(true);
        } else {
          setElapsed(e);
        }
      }, TICK_MS);
    },
    [clearTimer],
  );

  const dismiss = useCallback(() => {
    clearTimer();
    // Reveal everything left so the page never keeps stale skeletons.
    setElapsed(totalDurRef.current);
    setDone(false);
    setActive(false);
  }, [clearTimer]);

  const isReady = useCallback(
    (id: string) => {
      if (!active) return true;
      const idx = flatIdsRef.current.indexOf(id);
      if (idx === -1) return true;
      return idx < Math.floor(elapsed / perActivityRef.current);
    },
    [active, elapsed],
  );

  const moduleStatus = useCallback(
    (moduleId: string): ModuleStatus => {
      if (!active) return 'idle';
      const r = rangesRef.current.find((x) => x.moduleId === moduleId);
      if (!r) return 'idle';
      const rc = Math.max(0, Math.min(flatIdsRef.current.length, Math.floor(elapsed / perActivityRef.current)));
      if (rc >= r.end) return 'done';
      if (rc >= r.start) return 'active';
      return 'queued';
    },
    [active, elapsed],
  );

  // ── Derived summary for the toast / banner ──
  const ranges = rangesRef.current;
  const total = flatIdsRef.current.length;
  const readyCount = active ? Math.max(0, Math.min(total, Math.floor(elapsed / perActivityRef.current))) : total;
  const totalModules = ranges.length;

  let currentModuleIndex = totalModules;
  let currentRange: Range | undefined = ranges[ranges.length - 1];
  if (active && total > 0) {
    const activeIdx = Math.min(readyCount, total - 1);
    const found = ranges.findIndex((r) => activeIdx >= r.start && activeIdx < r.end);
    if (found >= 0) {
      currentModuleIndex = found + 1;
      currentRange = ranges[found];
    }
  }

  const currentModuleTitle = currentRange ? currentRange.title : null;
  const currentModuleActivityCount = currentRange ? currentRange.count : 0;
  const currentModuleReady = currentRange
    ? Math.max(0, Math.min(currentRange.count, readyCount - currentRange.start))
    : 0;
  const progress = active ? Math.min(100, (elapsed / totalDurRef.current) * 100) : 100;

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <Ctx.Provider
      value={{
        active,
        done,
        locked: active && !done,
        courseName,
        resumeHref,
        progress,
        totalModules,
        currentModuleIndex,
        currentModuleTitle,
        currentModuleActivityCount,
        currentModuleReady,
        isReady,
        moduleStatus,
        start,
        dismiss,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCourseGeneration(): CourseGenerationContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCourseGeneration must be used within CourseGenerationProvider');
  return v;
}

// ============================================================
// BackgroundTaskContext — global state for the bottom-right
// "task is running, feel free to leave the page" toast.
//
// Use case: long-running AI generation (slides, etc.) that can
// outlive the user navigating away from the originating page.
// ============================================================

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type TaskKind = 'slides' | 'pdf' | 'video' | 'document' | 'generic';

export interface BackgroundTask {
  id: string;
  kind: TaskKind;
  title: string;
  subtitle?: string;
  progress: number;
  /** Optional click target — where to take the user back to view the result. */
  resumeHref?: string;
}

interface BackgroundTaskContextValue {
  task: BackgroundTask | null;
  startTask: (init: Omit<BackgroundTask, 'progress'> & { durationMs?: number; onComplete?: () => void }) => string;
  updateProgress: (id: string, progress: number) => void;
  cancelTask: (id: string) => void;
}

const Ctx = createContext<BackgroundTaskContextValue | null>(null);

export function BackgroundTaskProvider({ children }: { children: ReactNode }) {
  const [task, setTask] = useState<BackgroundTask | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTask: BackgroundTaskContextValue['startTask'] = useCallback(
    ({ id, kind, title, subtitle, resumeHref, durationMs, onComplete }) => {
      clearTimer();
      onCompleteRef.current = onComplete ?? null;
      setTask({ id, kind, title, subtitle, resumeHref, progress: 0 });

      // If a duration is provided, drive the progress automatically.
      if (durationMs && durationMs > 0) {
        const start = Date.now();
        intervalRef.current = setInterval(() => {
          const elapsed = Date.now() - start;
          const pct = Math.min(100, (elapsed / durationMs) * 100);
          setTask((t) => (t && t.id === id ? { ...t, progress: pct } : t));
          if (elapsed >= durationMs) {
            clearTimer();
            // Fire onComplete so the host can update its data (e.g., mark
            // activity as created). The toast itself stays visible until the
            // user explicitly dismisses or clicks "View result".
            onCompleteRef.current?.();
            onCompleteRef.current = null;
          }
        }, 80);
      }
      return id;
    },
    [clearTimer],
  );

  const updateProgress = useCallback((id: string, progress: number) => {
    setTask((t) => (t && t.id === id ? { ...t, progress: Math.min(100, Math.max(0, progress)) } : t));
  }, []);

  const cancelTask = useCallback(
    (id: string) => {
      clearTimer();
      setTask((t) => (t && t.id === id ? null : t));
      onCompleteRef.current = null;
    },
    [clearTimer],
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  return <Ctx.Provider value={{ task, startTask, updateProgress, cancelTask }}>{children}</Ctx.Provider>;
}

export function useBackgroundTask(): BackgroundTaskContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useBackgroundTask must be used within BackgroundTaskProvider');
  return v;
}

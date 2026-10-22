// ============================================================
// BackgroundTaskToast — persistent bottom-right card that shows
// progress for a long-running task (AI slide generation, etc.).
// Persists across page navigation; the user can safely leave
// the originating page.
// ============================================================

import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FileText, Video, Presentation, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBackgroundTask } from '@/contexts/BackgroundTaskContext';
import type { TaskKind } from '@/contexts/BackgroundTaskContext';

const ICONS: Record<TaskKind, typeof Sparkles> = {
  slides: Presentation,
  pdf: FileText,
  video: Video,
  document: FileText,
  generic: Sparkles,
};

export function BackgroundTaskToast() {
  const { task, cancelTask } = useBackgroundTask();
  const navigate = useNavigate();

  const Icon = task ? ICONS[task.kind] : Sparkles;
  const isDone = task ? task.progress >= 100 : false;

  return (
    <AnimatePresence>
      {task && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed bottom-6 right-6 z-[60] w-[380px] bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(16,24,40,0.25)] border border-[#E9EAEB] overflow-hidden"
          role="status"
          aria-live="polite"
        >
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  isDone
                    ? 'bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0]'
                    : 'bg-gradient-to-br from-[#EFF4FF] to-[#E0E7FF]',
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                ) : (
                  <Icon className="w-5 h-5 text-[#1570EF]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#181D27] truncate">
                  {isDone ? 'Ready to review' : task.title}
                </p>
                <p className="text-[12px] text-[#717680] mt-0.5 leading-snug">
                  {isDone
                    ? `${task.title.replace(/…$/, '').replace(/Generating /i, '')} finished generating. Take a look when you’re ready.`
                    : task.subtitle ?? 'Feel free to keep working — we’ll keep this running in the background.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => cancelTask(task.id)}
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#A4A7AE] hover:bg-[#F5F5F5] hover:text-[#414651] transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-1.5 rounded-full bg-[#F5F5F5] overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    isDone
                      ? 'bg-gradient-to-r from-[#10B981] to-[#14B8A6]'
                      : 'bg-gradient-to-r from-[#4B7BF5] via-[#6366F1] to-[#3DBDB5]',
                  )}
                  animate={{ width: `${Math.min(100, task.progress)}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              {!isDone && (
                <div className="flex items-center justify-between mt-2 text-[11px] text-[#A4A7AE]">
                  <span>{Math.round(task.progress)}%</span>
                  <button
                    type="button"
                    onClick={() => cancelTask(task.id)}
                    className="text-[#D92D20] hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Done state — prominent CTA so the user knows there's something
                to check on, not just a quiet auto-dismiss. */}
            {isDone && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cancelTask(task.id)}
                  className="h-10 px-4 rounded-lg border border-[#E9EAEB] bg-white text-[13px] font-medium text-[#414651] hover:bg-[#F5F5F5] cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const href = task.resumeHref;
                    cancelTask(task.id);
                    if (href) navigate(href);
                  }}
                  className="flex-1 h-10 rounded-lg bg-[#0001FE] text-white text-[13px] font-semibold hover:brightness-[0.92] cursor-pointer transition-all inline-flex items-center justify-center gap-1.5"
                >
                  View now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

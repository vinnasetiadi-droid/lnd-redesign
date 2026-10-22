// ============================================================
// CourseGenerationToast — bottom-right card that tracks the AI
// writing each activity of a course. Mirrors BackgroundTaskToast
// so the two feel like one system. Persists across navigation.
// ============================================================

import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCourseGeneration } from '@/contexts/CourseGenerationContext';

export function CourseGenerationToast() {
  const {
    active, done, courseName, resumeHref, progress, dismiss,
    totalModules, currentModuleIndex,
    currentModuleActivityCount, currentModuleReady,
  } = useCourseGeneration();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AnimatePresence>
      {active && (
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
                  done
                    ? 'bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0]'
                    : 'bg-gradient-to-br from-[#EFF8FF] to-[#D1E9FF]',
                )}
              >
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                ) : (
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-5 h-5 text-[#1570EF]" />
                  </motion.div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#181D27] truncate">
                  {done ? 'Course content ready' : 'Generating course content…'}
                </p>
                <p className="text-[12px] text-[#717680] mt-0.5 leading-snug">
                  {done
                    ? `All ${totalModules} modules${courseName ? ` for “${courseName}”` : ''} are ready to review.`
                    : `Building ${totalModules} modules${courseName ? ` for “${courseName}”` : ''}. This can take a few minutes.`}
                </p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[#A4A7AE] hover:bg-[#F5F5F5] hover:text-[#414651] transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Per-module counter — which module + how many activities in it */}
            <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#414651]">
              <Layers className="w-3.5 h-3.5 text-[#A4A7AE]" />
              <span>Module {Math.min(currentModuleIndex, totalModules)} of {totalModules}</span>
              <span className="w-1 h-1 rounded-full bg-[#D5D7DA]" />
              <span className="text-[#1570EF]">
                {currentModuleReady} of {currentModuleActivityCount} activities
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-2">
              <div className="h-1.5 rounded-full bg-[#F5F5F5] overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    done
                      ? 'bg-gradient-to-r from-[#10B981] to-[#14B8A6]'
                      : 'bg-gradient-to-r from-[#1570EF] via-[#06B6D4] to-[#10B981]',
                  )}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              {!done && (
                <div className="mt-2 text-[11px] text-[#A4A7AE]">
                  <span>{Math.round(progress)}%</span>
                </div>
              )}
            </div>

            {/* Done state — prominent CTA */}
            {done && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={dismiss}
                  className="h-10 px-4 rounded-lg border border-[#E9EAEB] bg-white text-[13px] font-medium text-[#414651] hover:bg-[#F5F5F5] cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const href = resumeHref;
                    dismiss();
                    if (href && location.pathname !== href) navigate(href);
                  }}
                  className="flex-1 h-10 rounded-lg bg-[#0001FE] text-white text-[13px] font-semibold hover:brightness-[0.92] cursor-pointer transition-all inline-flex items-center justify-center gap-1.5"
                >
                  Review course
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

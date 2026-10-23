// ============================================================
// Upskill Studio — course card (grid view)
// Option B: a frameless cell in a hairline grid. A photo with small corners,
// the outlined status tag on its top left and the menu on its top right, then
// a two-line name with "by owner", a one-line description, one meta row (version, duration, mode),
// then a fixed-height footer: who acts next, the figure for the status and
// Review (only when someone else's course waits for you).
// ============================================================

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { type CourseLifecycleStatus } from '@/lib/courseActions';
import { AlertTriangle, BookOpen, Clock, EyeOff, Eye as EyeOn, Layers, MoreHorizontal, Trash2, X } from '@/variants/b/icons';
import { daysUntil, timeAgo } from '@/variants/b/pages/ld/dashboard/period';
import { NumText, PillButton } from '@/variants/b/components/ui/kit';
import { draftItemsOf, liveVersionOf, type CourseItem } from '../data/courses.mock';
import { ON_PHOTO, StatusBadge } from './CourseStatus';
import { DeleteVersionDialog } from '@/variants/b/components/common/DeleteVersionDialog';
import { CourseCover } from './CourseCover';
import { courseMode, ownerName, titleOf } from './CourseLibraryTable';

interface CourseCardProps {
  course: CourseItem;
  /** Signed-in admin: decides "You", and whether an in-review course can be reviewed */
  me: string;
  className?: string;
  /** Opens the course (also used by the card's action) */
  onClick?: () => void;
}

interface Footer {
  /** The figure for the status, then its words: "80" + "% completed", "20" + "days to start" */
  value: string;
  unit: string;
  /** Who acts next; the line is reserved on every card, so it can be empty */
  line?: { text: string; strong?: boolean };
  /** Small figure beside the menu (active: enrolled count) */
  aside?: string;
  /** Thin blue bar under the figure (active only) */
  progress?: number;
  /** In review and owned by someone else: the card's one button */
  review?: boolean;
}

function footerOf(course: CourseItem, me: string): Footer {
  switch (course.status) {
    case 'active':
      return { value: `${course.avgCompletion}%`, unit: 'completed', aside: `${course.trainees} enrolled`, progress: course.avgCompletion };
    case 'approved':
      return course.maxCapacity
        ? { value: `${course.trainees}/${course.maxCapacity}`, unit: 'seats filled' }
        : { value: `${course.trainees}`, unit: 'enrolled' };
    case 'waiting-approval': {
      const days = course.startsOn ? Math.max(0, daysUntil(course.startsOn)) : undefined;
      // Nobody reviews their own course
      const own = course.creator === me;
      return {
        ...(days !== undefined ? { value: `${days}`, unit: days === 1 ? 'day to start' : 'days to start' } : { value: '—', unit: 'no start date' }),
        line: own ? { text: 'Waiting for another admin' } : { text: 'Waiting for your review', strong: true },
        review: !own,
      };
    }
    case 'need-revision': {
      const n = course.reviewComments?.length ?? 0;
      return { value: `${n}`, unit: n === 1 ? 'comment' : 'comments' };
    }
    case 'on-draft':
      return course.sectionsTotal
        ? { value: `${course.sectionsReady ?? 0}/${course.sectionsTotal}`, unit: 'sections ready' }
        : { value: '0', unit: 'sections' };
    case 'inactive':
      return { value: `${course.completed ?? 0}/${course.trainees}`, unit: 'completed' };
  }
}

export function CourseCard({ course, me, className, onClick }: CourseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Only work that has never been published can be thrown away; anything
  // else is superseded by a new version instead.
  const canDelete = course.status === 'on-draft' || course.status === 'need-revision';
  const isActive = course.status === 'active';
  const isInactive = course.status === 'inactive';
  const canToggleStatus = isActive || isInactive;
  const drafts = course.draftOf ? 0 : draftItemsOf(course).length;
  const version = liveVersionOf(course);
  const f = footerOf(course, me);
  const menuItem = 'w-full flex items-center gap-2 rounded-(--ob-radius-control) px-3 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:bg-(--ob-surface)';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onClick?.()}
      className={cn(
        // Option B: no frame. A cell in the library's hairline grid (the page draws the
        // lines); it tints a little on hover. Rows share one height, footers line up.
        'group relative flex flex-col p-5 transition-colors duration-200 hover:bg-(--ob-surface-subtle) cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ob-primary)/25',
        className,
      )}
    >
      {/* Photo with nearly square corners: the status tag on its top left, the menu on its top right */}
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-[6px] bg-(--ob-surface)">
        <CourseCover
          course={course}
          size="lg"
          className={cn('absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.03]', isInactive && 'grayscale-[60%]')}
        />
      </div>
      <StatusBadge status={course.status} onImage className="absolute left-8 top-8" />
      {/* Outside the photo's clip, so the menu can open below it; clicks here never open the card */}
      <div className="absolute right-8 top-8 z-10" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="More actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={cn(ON_PHOTO, 'flex size-7 items-center justify-center text-(--ob-text-muted) transition-colors hover:text-(--ob-text-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/30 cursor-pointer')}
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div role="menu" className="absolute right-0 top-full z-20 mt-1 min-w-[170px] rounded-(--ob-radius-card) bg-(--ob-white) p-1 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]">
                <button
                  type="button"
                  role="menuitem"
                  disabled={!canToggleStatus}
                  className={cn(menuItem, canToggleStatus ? 'text-(--ob-text-body) hover:bg-(--ob-surface) cursor-pointer' : 'text-(--ob-border-control) cursor-not-allowed')}
                  onClick={() => { if (canToggleStatus) { setMenuOpen(false); setShowStatusConfirm(true); } }}
                >
                  {isInactive ? <EyeOn className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {isInactive ? 'Activate' : 'Deactivate'}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={!canDelete}
                  title={canDelete ? undefined : 'Only a draft or a version sent back for revision can be deleted.'}
                  className={cn(menuItem, canDelete ? 'text-(--ob-danger) hover:bg-(--ob-danger-surface) cursor-pointer' : 'text-(--ob-border-control) cursor-not-allowed')}
                  onClick={() => { if (canDelete) { setMenuOpen(false); setShowDeleteConfirm(true); } }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {/* Name: always two lines tall, so the rows below line up across cards */}
        <h3
          className={cn('line-clamp-2 h-[44px] text-[16px] leading-[22px]', isInactive ? 'text-(--ob-text-secondary)' : 'text-(--ob-text-strong)')}
          title={titleOf(course)}
        >
          {titleOf(course)}
        </h3>
        <p className="mt-0.5 truncate text-[12px] leading-[16px] text-(--ob-text-muted)">
          by <span className="text-(--ob-text-body)">{ownerName(course.creator, me)}</span>
          {' · '}
          {course.updatedOn ? timeAgo(course.updatedOn).toLowerCase() : course.updatedAt}
        </p>

        <p className="mt-2 truncate text-[13px] leading-[20px] text-(--ob-text-muted)" title={course.description}>
          {course.description}
        </p>

        {/* Meta: version, duration, mode */}
        <div className="mt-2.5 flex min-w-0 items-center gap-x-3 overflow-hidden whitespace-nowrap text-[12px] text-(--ob-text-muted)">
          <span className="inline-flex items-center gap-1.5">
            <Layers size={14} />
            v{version}
            {drafts > 0 && <span className="text-(--ob-primary)">+{drafts} draft</span>}
          </span>
          {course.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {course.duration.toLowerCase()}
            </span>
          )}
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <BookOpen size={14} className="shrink-0" />
            <span className="truncate">{courseMode(course)}</span>
          </span>
        </div>

        {/* Footer: fixed height and pinned to the bottom, so every card in a row ends on the same line */}
        <div className="mt-auto flex h-[80px] shrink-0 flex-col justify-end">
          {/* Status line: reserved on every card, empty when the status has nothing to say */}
          <p className={cn('h-4 truncate text-[12px] leading-[16px]', f.line?.strong ? 'text-(--ob-text-strong)' : 'text-(--ob-text-muted)')}>
            {f.line?.text}
          </p>
          <div className="mt-1 flex h-10 items-center justify-between gap-2">
            <p className="min-w-0 truncate">
              <span className="ob-num text-[20px] leading-[24px] font-semibold text-(--ob-text-strong)">{f.value}</span>
              <span className="ml-1 text-[12px] text-(--ob-text-muted)">{f.unit}</span>
            </p>
            <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
              {f.aside && <span className="text-[12px] text-(--ob-text-muted)"><NumText>{f.aside}</NumText></span>}
              {/* The same 3D secondary button as the review strip above the library */}
              {f.review && <PillButton onClick={onClick}>Review</PillButton>}
            </div>
          </div>
          {/* Progress slot: the thin blue bar on active courses (4px, 2px corners), empty otherwise */}
          <div className="mt-1 h-1">
            {f.progress !== undefined && (
              <div className="h-full overflow-hidden rounded-[2px] bg-(--ob-track)">
                <div className="h-full rounded-[2px] bg-(--ob-primary)" style={{ width: `${Math.min(100, f.progress)}%` }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DeleteVersionDialog
          open={showDeleteConfirm}
          subject="course"
          name={course.title}
          version={version}
          status={course.status as CourseLifecycleStatus}
          image={course.image}
          lastUpdate={course.updatedAt}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => setShowDeleteConfirm(false)}
        />
      </div>

      {/* Status toggle confirmation, portaled to body */}
      {showStatusConfirm && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(16,24,40,0.5)' }} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <div className="relative w-[460px] rounded-(--ob-radius-card) bg-(--ob-white) p-8 flex flex-col items-center text-center shadow-[0_24px_48px_-12px_rgba(16,24,40,0.18)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowStatusConfirm(false)} aria-label="Close" className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-(--ob-radius-control) text-(--ob-text-muted) transition-colors hover:bg-(--ob-surface) cursor-pointer">
              <X className="size-5" />
            </button>
            <div className="mb-5 flex size-14 items-center justify-center rounded-(--ob-radius-control) bg-(--ob-attention-surface)">
              <AlertTriangle className="size-7 text-(--ob-attention-text)" />
            </div>
            <h3 className="text-[16px] text-(--ob-text-strong)">
              {isActive ? 'Set course to inactive?' : 'Activate course?'}
            </h3>
            {isActive ? (
              <div className="mt-3 flex w-full flex-col gap-2 text-left">
                {[
                  'Only currently enrolled trainees will retain access.',
                  'New trainees will not be able to view or enroll in this course.',
                  'Other collaborators will be notified of this change.',
                ].map((line) => (
                  <p key={line} className="flex items-start gap-2 text-[12px] leading-[20px] text-(--ob-text-secondary)">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-(--ob-attention-bar)" />
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-(--ob-text-secondary)">
                This will reactivate <span className="text-(--ob-text-strong)">“{course.title}”</span>. New trainees will be able to view and enroll in this course again.
              </p>
            )}
            <div className="mt-6 flex w-full gap-3">
              <PillButton className="flex-1 justify-center" onClick={() => setShowStatusConfirm(false)}>Cancel</PillButton>
              <PillButton variant="primary" className="flex-1 justify-center" onClick={() => setShowStatusConfirm(false)}>
                {isActive ? 'Deactivate' : 'Activate'}
              </PillButton>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

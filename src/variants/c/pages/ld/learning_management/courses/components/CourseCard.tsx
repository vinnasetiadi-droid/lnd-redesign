// ============================================================
// Upskill Studio — course card (grid view), Option C
// Landscape, two to a row: the photo on the left with a dark status badge and
// a white menu button; on the right the name, a two-line description, one meta
// row (version, duration, mode), the figures for the status (with a bar on
// active courses), then the owner with the date and either Review (someone
// else's course waits for you) or an arrow to open the course.
// ============================================================

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { type CourseLifecycleStatus } from '@/lib/courseActions';
import { AlertTriangle, ArrowUpRight, EyeOff, Eye as EyeOn, MoreHorizontal, Trash2, X } from '@/variants/c/icons';
import { daysUntil, formatDate } from '@/variants/c/pages/ld/dashboard/period';
import { PillButton } from '@/variants/c/components/ui/kit';
import { COURSE_STATUS_META, draftItemsOf, liveVersionOf, type CourseItem } from '../data/courses.mock';
import { DeleteVersionDialog } from '@/variants/c/components/common/DeleteVersionDialog';
import { GLASS } from './CourseStatus';
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

interface Stats {
  /** Left: the figure for the status in words, "80% completed", or who acts next */
  left: string;
  /** "Waiting for your review" reads stronger than a figure */
  strong?: boolean;
  /** Right, muted: "25 enrolled", "Starts in 12 days" */
  right?: string;
  /** Blue bar under the row (active only) */
  progress?: number;
  /** In review and owned by someone else: Review instead of the arrow */
  review?: boolean;
}

function startsIn(iso?: string) {
  if (!iso) return 'No start date';
  const d = Math.max(0, daysUntil(iso));
  return d === 0 ? 'Starts today' : `Starts in ${d} ${d === 1 ? 'day' : 'days'}`;
}

function statsOf(course: CourseItem, me: string): Stats {
  switch (course.status) {
    case 'active':
      return { left: `${course.avgCompletion}% completed`, right: `${course.trainees} enrolled`, progress: course.avgCompletion };
    case 'approved':
      return {
        left: course.maxCapacity ? `${course.trainees}/${course.maxCapacity} seats filled` : `${course.trainees} enrolled`,
        right: startsIn(course.startsOn),
      };
    case 'waiting-approval': {
      // Nobody reviews their own course
      const own = course.creator === me;
      return {
        left: own ? 'Waiting for another admin' : 'Waiting for your review',
        strong: !own,
        right: startsIn(course.startsOn),
        review: !own,
      };
    }
    case 'need-revision': {
      const n = course.reviewComments?.length ?? 0;
      return { left: `${n} review ${n === 1 ? 'comment' : 'comments'}`, right: 'Back to the owner' };
    }
    case 'on-draft':
      return { left: course.sectionsTotal ? `${course.sectionsReady ?? 0}/${course.sectionsTotal} sections ready` : 'No sections yet' };
    case 'inactive':
      return { left: `${course.completed ?? 0}/${course.trainees} completed`, right: 'Not live' };
  }
}

const initials = (name?: string) =>
  (name ?? '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

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
  const f = statsOf(course, me);
  // In review: when it was sent; otherwise the last change
  const dated = course.status === 'waiting-approval' && course.submittedOn
    ? `Submitted ${formatDate(course.submittedOn)}`
    : `Updated ${course.updatedOn ? formatDate(course.updatedOn) : course.updatedAt}`;
  const menuItem = 'w-full flex items-center gap-2 rounded-(--oc-radius-control) px-3 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:bg-(--oc-surface)';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onClick?.()}
      className={cn(
        // Landscape: photo left, details right
        'oc-surface group flex gap-4 rounded-(--oc-radius-card) p-2.5 pr-4 transition-shadow duration-200 cursor-pointer',
        'hover:shadow-[0_1px_2px_rgba(10,25,41,0.04),0_14px_30px_-14px_rgba(10,25,41,0.18)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oc-primary)/25',
        className,
      )}
    >
      {/* Photo, inset and rounded, the card's full height; dark status badge top
          left, white menu top right. The overlays sit outside the clipped photo
          so the menu can open below it. */}
      <div className="relative w-[30%] min-h-[132px] shrink-0">
        <div className="absolute inset-0 overflow-hidden rounded-(--oc-radius-control) bg-(--oc-surface)">
          <CourseCover
            course={course}
            size="lg"
            className={cn('absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.03]', isInactive && 'grayscale-[60%]')}
          />
        </div>
        <span className="absolute left-2 top-2 inline-flex h-[22px] items-center whitespace-nowrap rounded-[6px] bg-(--oc-text-ink) px-2 text-[11px] leading-none text-(--oc-white)">
          {COURSE_STATUS_META[course.status].label}
        </span>
        {/* Clicks here never open the card */}
        <div className="absolute right-2 top-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="More actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={cn(GLASS, "flex size-6 items-center justify-center text-(--oc-text-strong) transition-colors hover:text-(--oc-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oc-primary)/40 cursor-pointer")}
            >
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div role="menu" className="absolute right-0 top-full z-20 mt-1 min-w-[170px] rounded-(--oc-radius-card) bg-(--oc-white) p-1 shadow-[0_8px_24px_-6px_rgba(10,25,41,0.18),0_2px_4px_rgba(10,25,41,0.04)]">
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!canToggleStatus}
                    className={cn(menuItem, canToggleStatus ? 'text-(--oc-text-body) hover:bg-(--oc-surface) cursor-pointer' : 'text-(--oc-border-control) cursor-not-allowed')}
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
                    className={cn(menuItem, canDelete ? 'text-(--oc-danger) hover:bg-(--oc-danger-surface) cursor-pointer' : 'text-(--oc-border-control) cursor-not-allowed')}
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
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-1.5">
        <h3
          className={cn('truncate text-[15px] leading-[22px]', isInactive ? 'text-(--oc-text-secondary)' : 'text-(--oc-text-strong)')}
          title={titleOf(course)}
        >
          {titleOf(course)}
        </h3>
        <p className="mt-0.5 truncate text-[13px] leading-[20px] text-(--oc-text-muted)" title={course.description}>
          {course.description}
        </p>

        {/* Meta: version, duration, mode */}
        <p className="mt-0.5 truncate text-[12px] leading-[18px] text-(--oc-text-subtle)">
          v{version}
          {drafts > 0 && <span className="text-(--oc-primary)"> +{drafts} draft</span>}
          {course.duration && <> · {course.duration.toLowerCase()}</>}
          {' · '}{courseMode(course)}
        </p>

        {/* The figures for the status; the bar only on active courses */}
        <div className="mt-2.5 flex items-baseline justify-between gap-3 text-[12px] leading-[18px]">
          <span className={cn('truncate', f.strong ? 'text-(--oc-text-strong)' : 'text-(--oc-text-body)')}>{f.left}</span>
          {f.right && <span className="shrink-0 tabular-nums text-(--oc-text-muted)">{f.right}</span>}
        </div>
        {f.progress !== undefined && (
          <div className="mt-1.5 h-1 overflow-hidden rounded-(--oc-radius-bar) bg-(--oc-surface)">
            <div className="h-full rounded-(--oc-radius-bar) bg-(--oc-primary)" style={{ width: `${Math.min(100, f.progress)}%` }} />
          </div>
        )}

        {/* Owner and date on one line, pinned to the bottom; Review or the open arrow on the right */}
        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--oc-surface) text-[10px] text-(--oc-text-body)">
            {initials(course.creator)}
          </span>
          <p className="min-w-0 flex-1 truncate text-[12px] leading-[18px] text-(--oc-text-muted)">
            <span className="text-(--oc-text-body)">{ownerName(course.creator, me)}</span> · {dated}
          </p>
          <div className="shrink-0" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            {f.review ? (
              <PillButton variant="primary" className="h-7 rounded-(--oc-radius-chip) px-3 text-[12px]" onClick={onClick}>Review</PillButton>
            ) : (
              <button
                type="button"
                onClick={onClick}
                aria-label="Open course"
                className="flex size-7 items-center justify-center rounded-(--oc-radius-chip) text-(--oc-text-subtle) transition-colors hover:bg-(--oc-surface) hover:text-(--oc-text-strong) cursor-pointer"
              >
                <ArrowUpRight size={16} />
              </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(10,25,41,0.5)' }} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <div className="relative w-[460px] rounded-(--oc-radius-card) bg-(--oc-white) p-8 flex flex-col items-center text-center shadow-[0_24px_48px_-12px_rgba(10,25,41,0.18)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowStatusConfirm(false)} aria-label="Close" className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-(--oc-radius-chip) text-(--oc-text-muted) transition-colors hover:bg-(--oc-surface) cursor-pointer">
              <X className="size-5" />
            </button>
            <div className="mb-5 flex size-14 items-center justify-center rounded-(--oc-radius-control) bg-(--oc-attention-surface)">
              <AlertTriangle className="size-7 text-(--oc-attention-text)" />
            </div>
            <h3 className="text-[16px] text-(--oc-text-strong)">
              {isActive ? 'Set course to inactive?' : 'Activate course?'}
            </h3>
            {isActive ? (
              <div className="mt-3 flex w-full flex-col gap-2 text-left">
                {[
                  'Only currently enrolled trainees will retain access.',
                  'New trainees will not be able to view or enroll in this course.',
                  'Other collaborators will be notified of this change.',
                ].map((line) => (
                  <p key={line} className="flex items-start gap-2 text-[12px] leading-[20px] text-(--oc-text-secondary)">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-(--oc-attention-bar)" />
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-(--oc-text-secondary)">
                This will reactivate <span className="text-(--oc-text-strong)">“{course.title}”</span>. New trainees will be able to view and enroll in this course again.
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

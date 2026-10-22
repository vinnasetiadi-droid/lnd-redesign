// ============================================================
// Upskill Studio — course card (grid view)
// Inset rounded photo with the status badge, name with "by owner", a
// two-line description, one meta row (version, duration, mode), then a
// headline figure for the status and the card's action.
// ============================================================

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { type CourseLifecycleStatus } from '@/lib/courseActions';
import { AlertTriangle, BookOpen, Clock, EyeOff, Eye as EyeOn, Layers, MoreHorizontal, Trash2, X } from '@/variants/a/icons';
import { daysUntil, timeAgo } from '@/variants/a/pages/ld/dashboard/period';
import { PillButton } from '@/variants/a/components/ui/kit';
import { draftItemsOf, liveVersionOf, type CourseItem } from '../data/courses.mock';
import { DeleteVersionDialog } from '@/variants/a/components/common/DeleteVersionDialog';
import { StatusBadge } from './CourseStatus';
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

/** The big figure at the bottom (like a price), its small unit, and the card's action */
function headline(course: CourseItem, me: string): { value: string; unit: string; action: string; note?: string } {
  switch (course.status) {
    case 'active':
      return { value: `${course.avgCompletion}%`, unit: 'completed', action: 'View' };
    case 'approved':
      return course.maxCapacity
        ? { value: `${course.trainees}/${course.maxCapacity}`, unit: 'seats filled', action: 'View' }
        : { value: `${course.trainees}`, unit: 'enrolled', action: 'View' };
    case 'waiting-approval': {
      const days = course.startsOn ? Math.max(0, daysUntil(course.startsOn)) : undefined;
      const own = course.creator === me;
      return {
        value: days !== undefined ? `${days}d` : '—',
        unit: 'to start',
        // Nobody reviews their own course
        action: own ? 'View' : 'Review',
        note: own ? 'Waiting for another admin' : 'Waiting for your review',
      };
    }
    case 'need-revision': {
      const n = course.reviewComments?.length ?? 0;
      return { value: `${n}`, unit: n === 1 ? 'comment' : 'comments', action: 'Comments' };
    }
    case 'on-draft':
      return course.sectionsTotal
        ? { value: `${course.sectionsReady ?? 0}/${course.sectionsTotal}`, unit: 'sections ready', action: 'Continue' }
        : { value: '0', unit: 'sections', action: 'Continue' };
    case 'inactive':
      return { value: `${course.completed ?? 0}/${course.trainees}`, unit: 'completed', action: 'Run again' };
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
  const h = headline(course, me);
  const menuItem = 'w-full flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:bg-(--oa-surface)';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onClick?.()}
      className={cn(
        // Portrait 3:4; grows only if its content needs more room
        'group flex aspect-[3/4] flex-col rounded-[18px] bg-(--oa-white) p-3 ring-1 ring-(--oa-border) transition-shadow duration-200 cursor-pointer',
        'hover:shadow-[0_12px_32px_-16px_rgba(16,24,40,0.18)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25',
        className,
      )}
    >
      {/* Photo, inset and rounded; status badge top right */}
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-[14px] bg-(--oa-surface)">
        <CourseCover
          course={course}
          size="lg"
          className={cn('absolute inset-0 size-full transition-transform duration-500 group-hover:scale-[1.03]', isInactive && 'grayscale-[60%]')}
        />
        <div className="absolute right-3 top-3">
          <StatusBadge status={course.status} onImage />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        {/* Name, then owner and last update */}
        <h3
          className={cn('truncate text-[15px] leading-[22px]', isInactive ? 'text-(--oa-text-secondary)' : 'text-(--oa-text-strong)')}
          title={titleOf(course)}
        >
          {titleOf(course)}
        </h3>
        <p className="mt-0.5 truncate text-[12px] leading-[18px] text-(--oa-text-muted)">
          by <span className="text-(--oa-text-body)">{ownerName(course.creator, me)}</span>
          {' · '}
          {course.updatedOn ? timeAgo(course.updatedOn).toLowerCase() : course.updatedAt}
        </p>

        <p className="mt-2 line-clamp-2 text-[13px] leading-[20px] text-(--oa-text-muted)" title={course.description}>
          {course.description}
        </p>

        {/* Meta: version, duration, mode */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-(--oa-text-muted)">
          <span className="inline-flex items-center gap-1.5">
            <Layers size={14} />
            v{version}
            {drafts > 0 && <span className="text-(--oa-primary)">+{drafts} draft</span>}
          </span>
          {course.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {course.duration.toLowerCase()}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} />
            {courseMode(course)}
          </span>
        </div>

        {/* Headline figure and the action */}
        {/* In review: who acts next, on its own line so it never truncates */}
        {h.note && <p className="mt-auto pt-4 text-[12px] leading-[18px] text-(--oa-primary-strong)">{h.note}</p>}
        <div className={cn('flex items-end justify-between gap-3', h.note ? 'pt-1' : 'mt-auto pt-4')}>
          <div className="min-w-0">
            <p className="text-[24px] leading-[28px] tabular-nums text-(--oa-text-strong)">{h.value}</p>
            <p className="truncate text-[12px] leading-[16px] text-(--oa-text-muted)">{h.unit}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <PillButton onClick={onClick}>{h.action}</PillButton>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="More actions"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex size-10 items-center justify-center rounded-full text-(--oa-text-muted) transition-colors hover:bg-(--oa-surface) hover:text-(--oa-text-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25 cursor-pointer"
              >
                <MoreHorizontal size={18} />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div role="menu" className="absolute bottom-full right-0 z-20 mb-1 min-w-[170px] rounded-[14px] bg-(--oa-white) p-1 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]">
                    <button
                      type="button"
                      role="menuitem"
                      disabled={!canToggleStatus}
                      className={cn(menuItem, canToggleStatus ? 'text-(--oa-text-body) hover:bg-(--oa-surface) cursor-pointer' : 'text-(--oa-border-control) cursor-not-allowed')}
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
                      className={cn(menuItem, canDelete ? 'text-(--oa-danger) hover:bg-(--oa-danger-surface) cursor-pointer' : 'text-(--oa-border-control) cursor-not-allowed')}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(16,24,40,0.5)' }}>
          <div className="relative w-[460px] rounded-[20px] bg-(--oa-white) p-8 flex flex-col items-center text-center shadow-[0_24px_48px_-12px_rgba(16,24,40,0.18)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowStatusConfirm(false)} aria-label="Close" className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-(--oa-text-muted) transition-colors hover:bg-(--oa-surface) cursor-pointer">
              <X className="size-5" />
            </button>
            <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-(--oa-attention-surface)">
              <AlertTriangle className="size-7 text-(--oa-attention-text)" />
            </div>
            <h3 className="text-[16px] text-(--oa-text-strong)">
              {isActive ? 'Set course to inactive?' : 'Activate course?'}
            </h3>
            {isActive ? (
              <div className="mt-3 flex w-full flex-col gap-2 text-left">
                {[
                  'Only currently enrolled trainees will retain access.',
                  'New trainees will not be able to view or enroll in this course.',
                  'Other collaborators will be notified of this change.',
                ].map((line) => (
                  <p key={line} className="flex items-start gap-2 text-[12px] leading-[20px] text-(--oa-text-secondary)">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-(--oa-attention-bar)" />
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[13px] text-(--oa-text-secondary)">
                This will reactivate <span className="text-(--oa-text-strong)">“{course.title}”</span>. New trainees will be able to view and enroll in this course again.
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

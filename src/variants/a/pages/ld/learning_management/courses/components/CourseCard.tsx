// ============================================================
// Upskill Studio — course card (grid view)
// Cover with status badge and menu, two-line name, type · mode · version,
// a footer that depends on the status, then owner and last update.
// ============================================================

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { type CourseLifecycleStatus } from '@/lib/courseActions';
import { AlertTriangle, Calendar, EyeOff, Eye as EyeOn, MoreHorizontal, Trash2, X } from '@/variants/a/icons';
import { formatDate, timeAgo } from '@/variants/a/pages/ld/dashboard/period';
import { PillButton } from '@/variants/a/components/ui/kit';
import { draftItemsOf, liveVersionOf, type CourseItem } from '../data/courses.mock';
import { DeleteVersionDialog } from '@/variants/a/components/common/DeleteVersionDialog';
import { StatusBadge } from './CourseStatus';
import { CourseCover } from './CourseCover';
import { courseMode, courseType, ownerName, titleOf } from './CourseLibraryTable';

interface CourseCardProps {
  course: CourseItem;
  /** Signed-in admin: decides "You", and whether an in-review course can be reviewed */
  me: string;
  className?: string;
  /** Opens the course (also used by Review and Run again) */
  onClick?: () => void;
}

/** "3 Nov" */
const dayMonth = (iso: string) => formatDate(iso).replace(/ \d{4}$/, '');
const initials = (name?: string) => (name ?? '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

function Bar({ value, tone = 'primary' }: { value: number; tone?: 'primary' | 'muted' }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--oa-border-strong)">
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', tone === 'primary' ? 'bg-(--oa-primary)' : 'bg-(--oa-text-subtle)')}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/** What matters for this status, below a hairline */
function StatusFooter({ course, me, onOpen }: { course: CourseItem; me: string; onOpen?: () => void }) {
  const row = 'flex items-baseline justify-between gap-3 text-[12px] leading-[18px]';
  switch (course.status) {
    case 'active':
      return (
        <div className="space-y-2">
          <div className={row}>
            <span className="text-(--oa-text-strong)">{course.avgCompletion}% completed</span>
            <span className="text-(--oa-text-muted)">{course.trainees} enrolled</span>
          </div>
          <Bar value={course.avgCompletion} />
        </div>
      );
    case 'waiting-approval':
      // Nobody reviews their own course
      return course.creator === me ? (
        <p className="text-[12px] leading-[18px] text-(--oa-text-muted)">Waiting for another admin</p>
      ) : (
        <div className="space-y-2">
          <p className="text-[12px] leading-[18px] text-(--oa-attention-text)">Waiting for your review</p>
          <PillButton
            className="w-full justify-center"
            onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
          >
            Review
          </PillButton>
        </div>
      );
    case 'need-revision': {
      const comments = course.reviewComments ?? [];
      return (
        <div className="space-y-1">
          <p className="text-[12px] leading-[18px] text-(--oa-danger)">
            {comments.length} reviewer {comments.length === 1 ? 'comment' : 'comments'}
          </p>
          {comments[0] && (
            <p className="truncate text-[12px] leading-[18px] text-(--oa-text-muted)" title={comments[0].text}>
              “{comments[0].text}”
            </p>
          )}
        </div>
      );
    }
    case 'on-draft': {
      const total = course.sectionsTotal ?? 0;
      const ready = course.sectionsReady ?? 0;
      return (
        <div className="space-y-2">
          <p className="text-[12px] leading-[18px] text-(--oa-text-body)">
            {total ? `${ready} of ${total} sections ready` : 'No sections yet'}
          </p>
          {total > 0 && (
            <div className="flex gap-1">
              {Array.from({ length: total }, (_, i) => (
                <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < ready ? 'bg-(--oa-primary)' : 'bg-(--oa-border-strong)')} />
              ))}
            </div>
          )}
        </div>
      );
    }
    case 'approved': {
      const cap = course.maxCapacity ?? 0;
      return (
        <div className="space-y-2">
          <div className={row}>
            <span className="inline-flex items-center gap-1.5 text-(--oa-text-strong)">
              <Calendar size={13} className="text-(--oa-text-muted)" />
              {course.startsOn ? `Starts ${dayMonth(course.startsOn)}` : 'Start date not set'}
            </span>
            <span className="text-(--oa-text-muted)">{course.trainees} enrolled</span>
          </div>
          {cap > 0 && (
            <>
              <Bar value={(course.trainees / cap) * 100} />
              <p className="text-[12px] leading-[18px] text-(--oa-text-muted)">{course.trainees} of {cap} seats filled</p>
            </>
          )}
        </div>
      );
    }
    case 'inactive':
      return (
        <div className="space-y-2">
          <div className={row}>
            <span className="text-(--oa-text-muted)">{course.endedOn ? `Ended ${dayMonth(course.endedOn)}` : 'Ended'}</span>
            <span className="text-(--oa-text-muted)">{course.completed ?? 0} of {course.trainees} completed</span>
          </div>
          <PillButton
            className="w-full justify-center"
            onClick={(e) => { e.stopPropagation(); onOpen?.(); }}
          >
            Run again
          </PillButton>
        </div>
      );
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
  const menuItem = 'w-full flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:bg-(--oa-surface)';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onClick?.()}
      className={cn(
        'group flex flex-col overflow-hidden rounded-[14px] bg-(--oa-surface-muted) transition-all duration-200 cursor-pointer',
        'hover:-translate-y-[2px] hover:shadow-[0_8px_24px_-8px_rgba(16,24,40,0.14)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25',
        className,
      )}
    >
      {/* Cover: status top left, menu top right */}
      <div className="relative h-[84px] w-full overflow-hidden">
        <CourseCover course={course} size="lg" className={cn('absolute inset-0 size-full', isInactive && 'grayscale-[40%]')} />
        <div className="absolute left-2.5 top-2.5">
          <StatusBadge status={course.status} onImage />
        </div>
        <div className="absolute right-2.5 top-2.5" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="More actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex size-7 items-center justify-center rounded-full bg-(--oa-white)/95 text-(--oa-text-body) shadow-[0_1px_2px_rgba(16,24,40,0.08)] transition-colors hover:bg-(--oa-white) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25 cursor-pointer"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div role="menu" className="absolute right-0 top-full z-20 mt-1 min-w-[170px] rounded-[14px] bg-(--oa-white) p-1 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]">
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

      <div className="flex flex-1 flex-col p-4">
        {/* Name: two lines at most, always two lines tall so cards line up */}
        <h3
          className={cn('line-clamp-2 h-10 text-[14px] leading-[20px]', isInactive ? 'text-(--oa-text-secondary)' : 'text-(--oa-text-strong)')}
          title={titleOf(course)}
        >
          {titleOf(course)}
        </h3>
        <p className="mt-1 truncate text-[12px] leading-[18px] text-(--oa-text-muted)">
          {courseType(course)} · {courseMode(course)} · v{version}
          {drafts > 0 && <span className="text-(--oa-primary)"> · +{drafts} draft</span>}
        </p>

        <div className="mt-3 border-t border-(--oa-border) pt-3">
          <StatusFooter course={course} me={me} onOpen={onClick} />
        </div>

        {/* Owner and last update, always last */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--oa-white) text-[10px] text-(--oa-text-body)">
              {initials(course.creator)}
            </span>
            <span className={cn('truncate text-[12px]', isInactive ? 'text-(--oa-text-muted)' : 'text-(--oa-text-body)')}>
              {ownerName(course.creator, me)}
            </span>
          </span>
          <span className="shrink-0 text-[12px] text-(--oa-text-muted)">{course.updatedOn ? timeAgo(course.updatedOn) : course.updatedAt}</span>
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

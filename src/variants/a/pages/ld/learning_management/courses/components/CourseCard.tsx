// ============================================================
// Upskill Studio — course card (grid view)
// Compact, no cover: status, category and menu on top; name and
// type · mode · version; then a two-line footer that depends on the status
// and the owner row, both pinned to the bottom so cards in a row line up.
// ============================================================

import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { type CourseLifecycleStatus } from '@/lib/courseActions';
import { AlertTriangle, ArrowRight, BookOpen, EyeOff, Eye as EyeOn, MoreHorizontal, Trash2, X } from '@/variants/a/icons';
import { daysUntil, formatDate, timeAgo } from '@/variants/a/pages/ld/dashboard/period';
import { PillButton } from '@/variants/a/components/ui/kit';
import { draftItemsOf, liveVersionOf, type CourseItem } from '../data/courses.mock';
import { DeleteVersionDialog } from '@/variants/a/components/common/DeleteVersionDialog';
import { StatusLabel } from './CourseStatus';
import { CATEGORY_ICON } from './CourseCover';
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
const startsIn = (iso?: string) => {
  if (!iso) return '';
  const d = daysUntil(iso);
  return d <= 0 ? 'starts today' : `starts in ${d} ${d === 1 ? 'day' : 'days'}`;
};

/** Footer line: text on the left, a number or a small action on the right */
function Line({ left, right, className }: { left: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 items-baseline justify-between gap-3 text-[12px] leading-[18px]', className)}>
      <span className="min-w-0 truncate">{left}</span>
      {right !== undefined && <span className="shrink-0">{right}</span>}
    </div>
  );
}

function Bar({ value, muted }: { value: number; muted?: boolean }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--oa-border-strong)">
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', muted ? 'bg-(--oa-text-subtle)' : 'bg-(--oa-primary)')}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/** A quiet text action, so the card never carries a heavy button */
function TextAction({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="inline-flex items-center gap-1 rounded-full text-(--oa-primary) transition-colors hover:text-(--oa-primary-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25 cursor-pointer"
    >
      {children}
      <ArrowRight size={13} />
    </button>
  );
}

/**
 * Two lines for every status, so footers are the same height:
 * a number and a bar (Active, Draft, Approved), or a status line with a
 * small action and a detail line (In review, Needs revision, Inactive).
 */
function StatusFooter({ course, me, onOpen }: { course: CourseItem; me: string; onOpen?: () => void }) {
  const muted = 'text-(--oa-text-muted)';
  const strong = 'text-(--oa-text-strong)';
  switch (course.status) {
    case 'active':
      return (
        <>
          <Line left={<span className={strong}>{course.avgCompletion}% completed</span>} right={<span className={muted}>{course.trainees} enrolled</span>} />
          <Bar value={course.avgCompletion} />
        </>
      );
    case 'on-draft': {
      const total = course.sectionsTotal ?? 0;
      const ready = course.sectionsReady ?? 0;
      return (
        <>
          <Line left={<span className={strong}>{total ? `${ready} of ${total} sections ready` : 'No sections yet'}</span>} right={<span className={muted}>Not live</span>} />
          <div className="flex h-1.5 gap-1">
            {Array.from({ length: Math.max(total, 1) }, (_, i) => (
              <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < ready ? 'bg-(--oa-primary)' : 'bg-(--oa-border-strong)')} />
            ))}
          </div>
        </>
      );
    }
    case 'approved': {
      const cap = course.maxCapacity ?? 0;
      return (
        <>
          <Line
            left={<span className={strong}>{course.startsOn ? `Starts ${dayMonth(course.startsOn)}` : 'Start date not set'}</span>}
            right={<span className={muted}>{cap ? `${course.trainees} of ${cap} seats` : `${course.trainees} enrolled`}</span>}
          />
          <Bar value={cap ? (course.trainees / cap) * 100 : 0} />
        </>
      );
    }
    case 'waiting-approval': {
      // Nobody reviews their own course
      const own = course.creator === me;
      return (
        <>
          <Line
            left={own ? <span className={strong}>Waiting for another admin</span> : <span className="text-(--oa-attention-text)">Waiting for your review</span>}
            right={own ? undefined : <TextAction onClick={onOpen}>Review</TextAction>}
          />
          <Line
            className={muted}
            left={[course.submittedOn && `Submitted ${timeAgo(course.submittedOn).toLowerCase()}`, startsIn(course.startsOn)].filter(Boolean).join(' · ')}
          />
        </>
      );
    }
    case 'need-revision': {
      const comments = course.reviewComments ?? [];
      return (
        <>
          <Line
            left={<span className={strong}>{comments.length} reviewer {comments.length === 1 ? 'comment' : 'comments'}</span>}
            right={<TextAction onClick={onOpen}>Open</TextAction>}
          />
          <Line className={muted} left={comments[0] ? <span title={comments[0].text}>“{comments[0].text}”</span> : 'No comments yet'} />
        </>
      );
    }
    case 'inactive':
      return (
        <>
          <Line
            left={<span className={muted}>{course.endedOn ? `Ended ${dayMonth(course.endedOn)}` : 'Ended'}</span>}
            right={<TextAction onClick={onOpen}>Run again</TextAction>}
          />
          <Line className={muted} left={`${course.completed ?? 0} of ${course.trainees} completed`} />
        </>
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
  const CategoryIcon = CATEGORY_ICON[course.category] ?? BookOpen;
  const menuItem = 'w-full flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:bg-(--oa-surface)';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && onClick?.()}
      className={cn(
        'group flex h-full flex-col rounded-[14px] bg-(--oa-surface-muted) p-4 transition-colors duration-200 cursor-pointer',
        'hover:bg-(--oa-surface)',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25',
        className,
      )}
    >
      {/* Top: status on the left, category and menu on the right */}
      <div className="flex items-center justify-between gap-2">
        <StatusLabel status={course.status} className="text-[12px]" />
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <span
            className="flex size-7 items-center justify-center rounded-full bg-(--oa-white) text-(--oa-text-ai)"
            title={courseType(course)}
          >
            <CategoryIcon size={14} />
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="More actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex size-7 items-center justify-center rounded-full text-(--oa-text-muted) transition-colors hover:bg-(--oa-white) hover:text-(--oa-text-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25 cursor-pointer"
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
      </div>

      {/* Name and type · mode · version */}
      <h3
        className={cn('mt-3 line-clamp-2 text-[14px] leading-[20px]', isInactive ? 'text-(--oa-text-secondary)' : 'text-(--oa-text-strong)')}
        title={titleOf(course)}
      >
        {titleOf(course)}
      </h3>
      <p className="mt-1 truncate text-[12px] leading-[18px] text-(--oa-text-muted)">
        {courseType(course)} · {courseMode(course)} · v{version}
        {drafts > 0 && <span className="text-(--oa-primary)"> · +{drafts} draft</span>}
      </p>

      {/* Footer and owner, pinned to the bottom so a row of cards lines up */}
      <div className="mt-auto pt-4">
        {/* Same height for every status (two 18px lines), so the hairlines line up across a row */}
        <div className="flex min-h-[57px] flex-col gap-2 border-t border-(--oa-border) pt-3">
          <StatusFooter course={course} me={me} onOpen={onClick} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
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

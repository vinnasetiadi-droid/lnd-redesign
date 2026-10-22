// ============================================================
// Upskill Studio — course list (the default view)
// Course | Status | Owner | Enrolled | Updated | actions. One row per course
// (its live version); a newer draft version opens as an indented row.
// Rows are split by hairlines, about 56px tall.
// ============================================================

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ChevronDown, MoreHorizontal } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/variants/a/motion';
import { timeAgo } from '@/variants/a/pages/ld/dashboard/period';
import { NOT_LIVE, draftItemsOf, liveVersionOf, type CourseItem } from '../data/courses.mock';
import { StatusLabel } from './CourseStatus';
import { CourseCover } from './CourseCover';

/** A course and its draft versions; `shown` is the item the row is about */
export interface CourseRow {
  key: string;
  shown: CourseItem;
  versions: CourseItem[];
}

export type TableSort = 'updated' | 'name' | 'enrolled';

interface CourseLibraryTableProps {
  rows: CourseRow[];
  /** Signed-in admin, shown as "You" */
  me: string;
  onOpen: (courseId: string) => void;
  /** Same value as the Sort chip; the headers set it too */
  sort: TableSort;
  onSort: (sort: TableSort) => void;
}

// Narrow screens: owner shows as initials only, so the course name keeps its room
const GRID =
  'grid grid-cols-[minmax(0,1fr)_112px_36px_76px_60px_32px] xl:grid-cols-[minmax(0,1fr)_132px_150px_84px_84px_32px] items-center gap-3 xl:gap-4';

export const courseType = (c: CourseItem) => (c.category === 'Compliance' ? 'Compliance' : 'Skill training');
export const courseMode = (c: CourseItem) => (c.learningType === 'Blended Learning' ? 'Blended' : 'Self-paced');
export const versionOf = (c: CourseItem) => liveVersionOf(c);
/** Draft versions read "Version N of <course>" */
export const titleOf = (c: CourseItem) => (c.draftOf ? `Version ${c.draftOf.version} of ${c.title}` : c.title);

/** "You", or "M. Torres" */
export function ownerName(creator: string | undefined, me: string) {
  if (!creator) return '—';
  if (creator === me) return 'You';
  const parts = creator.split(' ');
  return parts.length > 1 ? `${parts[0][0]}. ${parts.slice(1).join(' ')}` : creator;
}

const initials = (name?: string) =>
  (name ?? '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

function Owner({ creator, me }: { creator?: string; me: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2" title={ownerName(creator, me)}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--oa-surface) text-[11px] text-(--oa-text-body)">
        {initials(creator)}
      </span>
      <span className="hidden truncate text-[13px] text-(--oa-text-body) xl:inline">{ownerName(creator, me)}</span>
    </span>
  );
}

/** Active and Inactive: a number (Inactive muted). Approved: seats taken of capacity. Otherwise not live. */
export function enrolledText(c: CourseItem) {
  if (NOT_LIVE.includes(c.status)) return null;
  if (c.status === 'approved') return c.maxCapacity ? `${c.trainees} / ${c.maxCapacity}` : `${c.trainees}`;
  return `${c.trainees}`;
}

function Enrolled({ course }: { course: CourseItem }) {
  const text = enrolledText(course);
  if (!text) return <span className="text-right text-[12px] text-(--oa-text-subtle)">Not live</span>;
  return (
    <span className={cn('text-right text-[13px] tabular-nums', course.status === 'inactive' ? 'text-(--oa-text-muted)' : 'text-(--oa-text-strong)')}>
      {text}
    </span>
  );
}

const updatedText = (c: CourseItem) => (c.updatedOn ? timeAgo(c.updatedOn) : c.updatedAt);

export function RowMenu({ course, onOpen, className }: { course: CourseItem; onOpen: () => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const canToggle = course.status === 'active' || course.status === 'inactive';
  const canDelete = course.status === 'on-draft' || course.status === 'need-revision';
  const item = 'w-full rounded-[10px] px-3 py-2 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:bg-(--oa-surface)';
  return (
    // The menu never triggers the row click
    <div className={cn('relative justify-self-end', className)} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex size-8 items-center justify-center rounded-full text-(--oa-text-muted) transition-colors hover:bg-(--oa-surface) hover:text-(--oa-text-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25 cursor-pointer"
      >
        <MoreHorizontal size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: EASE_OUT }}
              className="absolute right-0 top-full z-20 mt-1 min-w-[170px] rounded-[14px] bg-(--oa-white) p-1 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]"
            >
              <button type="button" role="menuitem" className={cn(item, 'text-(--oa-text-body) hover:bg-(--oa-surface) cursor-pointer')} onClick={() => { setOpen(false); onOpen(); }}>
                View details
              </button>
              {canToggle && (
                <button type="button" role="menuitem" className={cn(item, 'text-(--oa-text-body) hover:bg-(--oa-surface) cursor-pointer')} onClick={() => setOpen(false)}>
                  {course.status === 'active' ? 'Hide from trainees' : 'Show to trainees'}
                </button>
              )}
              {canDelete && (
                <button type="button" role="menuitem" className={cn(item, 'text-(--oa-danger) hover:bg-(--oa-danger-surface) cursor-pointer')} onClick={() => setOpen(false)}>
                  Delete
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseRowView({ row, me, onOpen, index }: { row: CourseRow; me: string; onOpen: (id: string) => void; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const c = row.shown;
  const drafts = c.draftOf ? [] : draftItemsOf(c);
  const ownReview = c.status === 'waiting-approval' && c.creator === me;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: EASE_OUT, delay: index * 0.03 }}
      className="border-b border-(--oa-border) last:border-b-0"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(c.id)}
        onKeyDown={(e) => e.key === 'Enter' && onOpen(c.id)}
        className={cn(GRID, 'min-h-14 px-3 py-[9px] transition-colors hover:bg-(--oa-surface-subtle) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--oa-primary)/25 cursor-pointer')}
      >
        <div className="flex min-w-0 items-center gap-3">
          <CourseCover course={c} size="sm" className="h-[30px] w-11 shrink-0 rounded-[8px]" />
          <div className="min-w-0">
            <p className="truncate text-[13px] leading-[20px] text-(--oa-text-strong)" title={titleOf(c)}>{titleOf(c)}</p>
            <p className="flex min-w-0 items-center gap-1 text-[12px] leading-[18px] text-(--oa-text-muted)">
              <span className="truncate">{courseType(c)} · {courseMode(c)} · v{versionOf(c)}</span>
              {drafts.length > 0 && (
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={(e) => { e.stopPropagation(); setExpanded((x) => !x); }}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="inline-flex shrink-0 items-center gap-0.5 rounded-full text-(--oa-primary) transition-colors hover:text-(--oa-primary-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25 cursor-pointer"
                >
                  · {drafts.length} draft
                  <ChevronDown size={14} className={cn('transition-transform duration-200', expanded && 'rotate-180')} />
                </button>
              )}
            </p>
          </div>
        </div>
        <div className="min-w-0">
          <StatusLabel status={c.status} />
          {/* Nobody reviews their own course */}
          {ownReview && <p className="mt-1 truncate text-[11px] leading-[14px] text-(--oa-text-subtle)">Waiting for another admin</p>}
        </div>
        <Owner creator={c.creator} me={me} />
        <Enrolled course={c} />
        <span className="text-right text-[12px] text-(--oa-text-muted)">{updatedText(c)}</span>
        <RowMenu course={c} onOpen={() => onOpen(c.id)} />
      </div>

      {/* Draft version under its course */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            {drafts.map((v) => (
              <div
                key={v.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpen(v.id)}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(v.id)}
                className={cn(GRID, 'border-t border-dashed border-(--oa-border) px-3 py-2 transition-colors hover:bg-(--oa-surface-subtle) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--oa-primary)/25 cursor-pointer')}
              >
                <p className="truncate pl-14 text-[12px] text-(--oa-text-body)">Version {v.draftOf?.version} (draft)</p>
                <StatusLabel status="on-draft" />
                <Owner creator={v.creator} me={me} />
                <span className="text-right text-[12px] text-(--oa-text-subtle)">Not live</span>
                <span className="text-right text-[12px] text-(--oa-text-muted)">{updatedText(v)}</span>
                <RowMenu course={v} onOpen={() => onOpen(v.id)} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SortHeader({ label, value, sort, onSort, align = 'left' }: {
  label: string;
  value: TableSort;
  sort: TableSort;
  onSort: (s: TableSort) => void;
  align?: 'left' | 'right';
}) {
  const active = sort === value;
  return (
    <button
      type="button"
      onClick={() => onSort(value)}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25',
        align === 'right' && 'justify-self-end',
        active ? 'text-(--oa-text-strong)' : 'hover:text-(--oa-text-body)',
      )}
    >
      {label}
      <ArrowDown size={12} className={cn('transition-opacity', active ? 'opacity-100' : 'opacity-0')} />
    </button>
  );
}

export function CourseLibraryTable({ rows, me, onOpen, sort, onSort }: CourseLibraryTableProps) {
  return (
    // Phones: the table scrolls sideways inside its card instead of widening the page
    <div className="min-w-0 max-md:-mx-1 max-md:overflow-x-auto max-md:px-1">
    <div className="max-md:min-w-[600px]">
      <div className={cn(GRID, 'border-b border-(--oa-border) px-3 pb-2.5 text-[12px] text-(--oa-text-muted)')}>
        <SortHeader label="Course" value="name" sort={sort} onSort={onSort} />
        <span>Status</span>
        <span className="whitespace-nowrap">Owner</span>
        <SortHeader label="Enrolled" value="enrolled" sort={sort} onSort={onSort} align="right" />
        <SortHeader label="Updated" value="updated" sort={sort} onSort={onSort} align="right" />
        <span />
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        {rows.map((row, i) => (
          <CourseRowView key={row.key} row={row} me={me} onOpen={onOpen} index={i} />
        ))}
      </AnimatePresence>
    </div>
    </div>
  );
}

// ============================================================
// Upskill Studio — course list (the default view)
// One row per course: small thumbnail, name with a type · mode · version
// subline, status, owner, enrolled, last update. Versions of the same course
// sit under one row and expand.
// ============================================================

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, MoreHorizontal } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { EASE_OUT } from '@/variants/a/motion';
import { formatDate, timeAgo } from '@/variants/a/pages/ld/dashboard/period';
import { latestVersionOf } from '@/lib/latestVersion';
import { ADMIN_COURSE_VERSIONS, COURSE_STATUS_META, NOT_LIVE, type CourseItem } from '../data/courses.mock';

/** A course and all of its versions; `shown` is the version the row is about */
export interface CourseRow {
  key: string;
  shown: CourseItem;
  versions: CourseItem[];
}

interface CourseLibraryTableProps {
  rows: CourseRow[];
  /** Signed-in admin, shown as "You" */
  me: string;
  onOpen: (courseId: string) => void;
}

// Narrow screens: owner shows as initials only, so the course name keeps its room
const GRID =
  'grid grid-cols-[minmax(0,1fr)_112px_36px_68px_60px_32px] xl:grid-cols-[minmax(0,1fr)_132px_150px_84px_84px_32px] items-center gap-3 xl:gap-4';

export const courseType = (c: CourseItem) => (c.category === 'Compliance' ? 'Compliance' : 'Skill training');
export const courseMode = (c: CourseItem) => (c.learningType === 'Blended Learning' ? 'Blended' : 'Self-paced');
export const versionOf = (c: CourseItem) => latestVersionOf(ADMIN_COURSE_VERSIONS, c.id);

/** "You", or "M. Torres" */
export function ownerName(creator: string | undefined, me: string) {
  if (!creator) return '—';
  if (creator === me) return 'You';
  const parts = creator.split(' ');
  return parts.length > 1 ? `${parts[0][0]}. ${parts.slice(1).join(' ')}` : creator;
}

const initials = (name?: string) =>
  (name ?? '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

/** Day and month only: "3 Nov" */
const shortDate = (iso: string) => formatDate(iso).replace(/ \d{4}$/, '');

export function StatusLabel({ status }: { status: CourseItem['status'] }) {
  const meta = COURSE_STATUS_META[status];
  return (
    <span className="flex items-center gap-2 text-[13px] text-(--oa-text-body)">
      <span className="size-2 shrink-0 rounded-full" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}

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

function Enrolled({ course }: { course: CourseItem }) {
  // Drafts and courses in review cannot have trainees yet
  return NOT_LIVE.includes(course.status) ? (
    <span className="text-right text-[12px] text-(--oa-text-subtle)">Not live</span>
  ) : (
    <span className="text-right text-[13px] tabular-nums text-(--oa-text-strong)">{course.trainees}</span>
  );
}

function RowMenu({ course, onOpen }: { course: CourseItem; onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const canToggle = course.status === 'active' || course.status === 'inactive';
  const canDelete = course.status === 'on-draft' || course.status === 'need-revision';
  const item = 'w-full rounded-[10px] px-3 py-2 text-left text-[13px] transition-colors';
  return (
    <div className="relative justify-self-end" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label="More actions"
        onClick={() => setOpen((o) => !o)}
        className="flex size-8 items-center justify-center rounded-full text-(--oa-text-muted) transition-colors hover:bg-(--oa-surface) hover:text-(--oa-text-strong) cursor-pointer"
      >
        <MoreHorizontal size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ease: EASE_OUT }}
              className="absolute right-0 top-full z-20 mt-1 min-w-[170px] rounded-[14px] bg-(--oa-white) p-1 shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)]"
            >
              <button type="button" className={cn(item, 'text-(--oa-text-body) hover:bg-(--oa-surface) cursor-pointer')} onClick={() => { setOpen(false); onOpen(); }}>
                View details
              </button>
              {canToggle && (
                <button type="button" className={cn(item, 'text-(--oa-text-body) hover:bg-(--oa-surface) cursor-pointer')} onClick={() => setOpen(false)}>
                  {course.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              )}
              {canDelete && (
                <button type="button" className={cn(item, 'text-(--oa-danger) hover:bg-(--oa-danger-surface) cursor-pointer')} onClick={() => setOpen(false)}>
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
  const others = row.versions.filter((v) => v.id !== c.id);
  const starts = c.status === 'approved' && c.startsOn ? ` · starts ${shortDate(c.startsOn)}` : '';

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
        className={cn(GRID, 'rounded-[12px] px-3 py-3 transition-colors hover:bg-(--oa-surface-subtle) cursor-pointer')}
      >
        <div className="flex min-w-0 items-center gap-3">
          <ImageWithFallback src={c.image} alt="" className="h-10 w-14 shrink-0 rounded-[10px] object-cover" />
          <div className="min-w-0">
            <p className="truncate text-[13px] leading-[20px] text-(--oa-text-strong)" title={c.title}>{c.title}</p>
            <p className="flex min-w-0 items-center gap-1 text-[12px] leading-[18px] text-(--oa-text-muted)">
              <span className="truncate">{courseType(c)} · {courseMode(c)} · v{versionOf(c)}{starts}</span>
              {others.length > 0 && (
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={(e) => { e.stopPropagation(); setExpanded((x) => !x); }}
                  className="inline-flex shrink-0 items-center gap-0.5 text-(--oa-primary) transition-colors hover:text-(--oa-primary-strong) cursor-pointer"
                >
                  · {row.versions.length} versions
                  <ChevronDown size={14} className={cn('transition-transform duration-200', expanded && 'rotate-180')} />
                </button>
              )}
            </p>
          </div>
        </div>
        <StatusLabel status={c.status} />
        <Owner creator={c.creator} me={me} />
        <Enrolled course={c} />
        <span className="text-right text-[12px] text-(--oa-text-muted)">{c.updatedOn ? timeAgo(c.updatedOn) : c.updatedAt}</span>
        <RowMenu course={c} onOpen={() => onOpen(c.id)} />
      </div>

      {/* Other versions of the same course */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            {others.map((v) => (
              <div
                key={v.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpen(v.id)}
                onKeyDown={(e) => e.key === 'Enter' && onOpen(v.id)}
                className={cn(GRID, 'mb-1 rounded-[12px] bg-(--oa-surface-muted) px-3 py-2.5 transition-colors hover:bg-(--oa-surface) cursor-pointer')}
              >
                <p className="truncate pl-[68px] text-[12px] text-(--oa-text-muted)">
                  Version {versionOf(v)} · {courseMode(v)}
                </p>
                <StatusLabel status={v.status} />
                <Owner creator={v.creator} me={me} />
                <Enrolled course={v} />
                <span className="text-right text-[12px] text-(--oa-text-muted)">{v.updatedOn ? timeAgo(v.updatedOn) : v.updatedAt}</span>
                <RowMenu course={v} onOpen={() => onOpen(v.id)} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CourseLibraryTable({ rows, me, onOpen }: CourseLibraryTableProps) {
  return (
    <div className="min-w-0">
      <div className={cn(GRID, 'border-b border-(--oa-border) px-3 pb-2.5 text-[12px] text-(--oa-text-muted)')}>
        <span>Course</span>
        <span>Status</span>
        <span>Owner</span>
        <span className="text-right">Enrolled</span>
        <span className="text-right">Updated</span>
        <span />
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        {rows.map((row, i) => (
          <CourseRowView key={row.key} row={row} me={me} onOpen={onOpen} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}

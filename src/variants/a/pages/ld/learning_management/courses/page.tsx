// ============================================================
// Courses Listing Page — Upskill Studio
// Route: /ld/learning-management/courses
//
// One primary action (Create course), a one-line review queue that only
// shows when someone else's course waits for review, status tabs with counts
// (they are the filter), one row of filters, and the list as the default.
// ============================================================

import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  LayoutGrid,
  List,
  Loader2,
  Plus,
  Search,
} from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import { matchesOwnership, useCurrentUserName, type OwnershipFilter } from '../components/OwnershipTabs';
import { DashboardLayout } from '@/variants/a/layouts/DashboardLayout';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { CourseCard } from './components/CourseCard';
import { CourseLibraryTable, courseMode, courseType, ownerName, type CourseRow } from './components/CourseLibraryTable';
import { COURSES_MOCK, COURSE_STATUS_META, NOT_LIVE, draftItemsOf, type CourseItem, type CourseStatus } from './data/courses.mock';
import { CardHeader, IconCircle, PillButton } from '@/variants/a/components/ui/kit';
import { FilterChip } from './components/FilterChip';
import { ProgramScopeTabs, type ScopeTab } from '@/variants/a/pages/ld/dashboard/components/ProgramScopeTabs';
import { daysUntil, timeAgo } from '@/variants/a/pages/ld/dashboard/period';
import { revealContainer, revealItem } from '@/variants/a/motion';

const PAGE_SIZE = 8;

type StatusFilter = 'all' | CourseStatus;
type TypeFilter = 'all' | 'Compliance' | 'Skill training';
type ModeFilter = 'all' | 'Blended' | 'Self-paced';
type SortKey = 'updated' | 'name' | 'enrolled';

/** The viewer's list/grid choice; storage can be blocked, so every access is guarded */
const VIEW_KEY = 'oa-upskill-studio-view';
function readView(): 'list' | 'grid' {
  try {
    return localStorage.getItem(VIEW_KEY) === 'grid' ? 'grid' : 'list';
  } catch {
    return 'list';
  }
}
function saveView(view: 'list' | 'grid') {
  try {
    localStorage.setItem(VIEW_KEY, view);
  } catch {
    /* storage blocked: the choice just isn't remembered */
  }
}

const EMPTY_TEXT: Record<StatusFilter, string> = {
  all: 'No courses',
  'on-draft': 'No drafts',
  'waiting-approval': 'No courses in review',
  'need-revision': 'No courses need revision',
  approved: 'No approved courses',
  active: 'No active courses',
  inactive: 'No inactive courses',
};

const STATUS_ORDER: CourseStatus[] = ['on-draft', 'waiting-approval', 'need-revision', 'approved', 'active', 'inactive'];


export default function CoursesPage() {
  const navigate = useNavigate();
  const me = useCurrentUserName();
  const libraryRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<StatusFilter>('all');
  const [owner, setOwner] = useState<OwnershipFilter>('all');
  const [type, setType] = useState<TypeFilter>('all');
  const [mode, setMode] = useState<ModeFilter>('all');
  const [sort, setSort] = useState<SortKey>('updated');
  const [search, setSearch] = useState('');
  const isSearching = useSimulatedLoading(search);
  const [page, setPage] = useState(1);
  const [viewMode, setViewModeState] = useState<'list' | 'grid'>(readView);
  const setViewMode = (view: 'list' | 'grid') => {
    setViewModeState(view);
    saveView(view);
  };

  const openCourse = (id: string) => navigate(`/ld/learning-management/courses/overview/${id}`);

  // Everything except the status tab, so each tab's count is what it would show
  const matches = (c: CourseItem) =>
    matchesOwnership(c, owner, me) &&
    (type === 'all' || courseType(c) === type) &&
    (mode === 'all' || courseMode(c) === mode) &&
    (!search.trim() || c.title.toLowerCase().includes(search.trim().toLowerCase()));

  // One row per course (its live version). Draft versions of live courses are
  // their own rows in the Draft tab, and sit under their course everywhere else.
  const rowsFor = (s: StatusFilter): CourseRow[] =>
    COURSES_MOCK.flatMap((c) => {
      const drafts = draftItemsOf(c);
      if (s === 'on-draft') {
        return [c, ...drafts]
          .filter((x) => x.status === 'on-draft' && matches(x))
          .map((x) => ({ key: x.id, shown: x, versions: [x] }));
      }
      if ((s !== 'all' && c.status !== s) || !matches(c)) return [];
      return [{ key: c.id, shown: c, versions: [c, ...drafts] }];
    });

  const tabs: ScopeTab<StatusFilter>[] = [
    { key: 'all', label: 'All', count: rowsFor('all').length },
    ...STATUS_ORDER.map((s) => ({ key: s, label: COURSE_STATUS_META[s].label, count: rowsFor(s).length })),
  ];

  const rows = useMemo(() => {
    const list = rowsFor(status);
    const live = (c: CourseItem) => (NOT_LIVE.includes(c.status) ? -1 : c.trainees);
    return [...list].sort((a, b) =>
      sort === 'name' ? a.shown.title.localeCompare(b.shown.title)
      : sort === 'enrolled' ? live(b.shown) - live(a.shown)
      : (b.shown.updatedOn ?? '').localeCompare(a.shown.updatedOn ?? ''),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, owner, type, mode, sort, search, me]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paginated = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const reset = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(1); };
  const filtersActive = owner !== 'all' || type !== 'all' || mode !== 'all' || search.trim() !== '';
  const clearFilters = () => {
    setOwner('all');
    setType('all');
    setMode('all');
    setSearch('');
    setPage(1);
  };

  // Only other people's submissions: nobody approves their own course
  const reviewQueue = COURSES_MOCK.filter((c) => c.status === 'waiting-approval' && c.creator !== me);
  // With several, the strip points at the one that starts soonest
  const soonest = [...reviewQueue].sort((a, b) => (a.startsOn ?? '9').localeCompare(b.startsOn ?? '9'))[0];
  const startsIn = (c: CourseItem) => {
    if (!c.startsOn) return '';
    const d = daysUntil(c.startsOn);
    return d <= 0 ? 'starts today' : `starts in ${d} ${d === 1 ? 'day' : 'days'}`;
  };
  const openReviewTab = () => {
    setStatus('waiting-approval');
    setPage(1);
    libraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <DashboardLayout>
      <motion.div className="w-full flex flex-col min-w-0 gap-3" variants={revealContainer} initial="hidden" animate="visible">
        {/* ── Header: one primary (blue) action ── */}
        <motion.div variants={revealItem} className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[24px] leading-[32px] text-(--oa-text-strong)">Upskill Studio</h1>
            <p className="mt-0.5 text-[13px] text-(--oa-text-muted)">Create, review and assign courses for your teams</p>
          </div>
          <PillButton variant="primary" icon={Plus} onClick={() => navigate('/ld/learning-management/courses/create-offline')}>
            Create course
          </PillButton>
        </motion.div>

        {/* ── Review queue: one line, only when there is something to review ── */}
        {reviewQueue.length > 0 && (
          <motion.div variants={revealItem} className="oa-lift flex items-center gap-4 rounded-[18px] bg-(--oa-white) px-5 py-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--oa-attention-surface) text-(--oa-attention-text)">
              <Clock size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-[20px] text-(--oa-text-strong)">
                {reviewQueue.length} {reviewQueue.length === 1 ? 'course' : 'courses'} waiting for your review
              </p>
              <p className="truncate text-[12px] leading-[18px] text-(--oa-text-muted)">
                {reviewQueue.length === 1
                  ? [
                      reviewQueue[0].title,
                      `by ${reviewQueue[0].creator}`,
                      reviewQueue[0].submittedOn && `submitted ${timeAgo(reviewQueue[0].submittedOn).toLowerCase()}`,
                      startsIn(reviewQueue[0]),
                    ].filter(Boolean).join(' · ')
                  : [`${soonest.title} by ${ownerName(soonest.creator, me)}`, startsIn(soonest)].filter(Boolean).join(' · ')}
              </p>
            </div>
            {/* One course: open it. Several: show them all in the In review tab */}
            {reviewQueue.length === 1 ? (
              <PillButton onClick={() => openCourse(reviewQueue[0].id)}>Review</PillButton>
            ) : (
              <PillButton onClick={openReviewTab}>Review all</PillButton>
            )}
          </motion.div>
        )}

        {/* ── Library ── */}
        <motion.div ref={libraryRef} variants={revealItem} className="flex flex-col gap-4 rounded-[18px] bg-(--oa-white) p-5 scroll-mt-3">
          <CardHeader title="Course library" subtitle={`${rows.length} ${rows.length === 1 ? 'course' : 'courses'}`} />

          {/* Status tabs: the counts are the filter; they scroll sideways on narrow screens */}
          <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none]">
            <ProgramScopeTabs id="course-status" value={status} onChange={reset(setStatus)} tabs={tabs} />
          </div>

          {/* One row of filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 max-w-[320px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-(--oa-text-muted)" />
              <input
                type="text"
                placeholder="Search courses"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full h-9 rounded-full bg-(--oa-surface) pl-10 pr-9 text-[13px] text-(--oa-text-strong) placeholder:text-(--oa-text-subtle) outline-none transition-colors focus:bg-(--oa-white) focus:ring-2 focus:ring-(--oa-primary)/25"
              />
              {isSearching && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-(--oa-primary) animate-spin" />
              )}
            </div>

            <FilterChip
              name="Owner"
              value={owner}
              onChange={reset(setOwner)}
              options={[
                { value: 'all', label: 'Anyone' },
                { value: 'mine', label: 'You' },
                { value: 'admin', label: 'Other admins' },
                { value: 'trainer', label: 'Trainers' },
              ]}
            />
            <FilterChip
              name="Type"
              value={type}
              onChange={reset(setType)}
              options={[
                { value: 'all', label: 'All types' },
                { value: 'Compliance', label: 'Compliance' },
                { value: 'Skill training', label: 'Skill training' },
              ]}
            />
            <FilterChip
              name="Mode"
              value={mode}
              onChange={reset(setMode)}
              options={[
                { value: 'all', label: 'All modes' },
                { value: 'Blended', label: 'Blended' },
                { value: 'Self-paced', label: 'Self-paced' },
              ]}
            />
            <FilterChip
              name="Sort"
              showValueOnly
              icon={ArrowUpDown}
              value={sort}
              onChange={reset(setSort)}
              options={[
                { value: 'updated', label: 'Last updated' },
                { value: 'name', label: 'Name A to Z' },
                { value: 'enrolled', label: 'Most enrolled' },
              ]}
            />

            {/* View: list by default, grid to browse */}
            <div className="ml-auto flex items-center gap-0.5 rounded-full bg-(--oa-surface) p-1">
              {([['list', List, 'List view'], ['grid', LayoutGrid, 'Grid view']] as const).map(([m, Icon, label]) => (
                <button
                  key={m}
                  type="button"
                  aria-label={label}
                  aria-pressed={viewMode === m}
                  onClick={() => setViewMode(m)}
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25',
                    viewMode === m
                      ? 'bg-(--oa-white) text-(--oa-text-strong) shadow-[0_1px_2px_rgba(16,24,40,0.08),0_1px_3px_rgba(16,24,40,0.06)]'
                      : 'text-(--oa-text-muted) hover:text-(--oa-text-body)',
                  )}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Courses */}
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <IconCircle icon={GraduationCap} className="size-10" />
              <p className="text-[13px] text-(--oa-text-muted)">
                {EMPTY_TEXT[status]}{filtersActive ? ' match these filters' : ''}
              </p>
              {filtersActive && <PillButton onClick={clearFilters}>Clear filters</PillButton>}
            </div>
          ) : viewMode === 'list' ? (
            <CourseLibraryTable rows={paginated} me={me} onOpen={openCourse} sort={sort} onSort={reset(setSort)} />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginated.map((row) => (
                <CourseCard key={row.key} course={row.shown} me={me} onClick={() => openCourse(row.shown.id)} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {rows.length > 0 && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-[12px] text-(--oa-text-muted)">
                Showing {(current - 1) * PAGE_SIZE + 1} to {Math.min(current * PAGE_SIZE, rows.length)} of {rows.length} courses
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous page"
                    onClick={() => setPage(Math.max(1, current - 1))}
                    disabled={current === 1}
                    className="flex size-8 items-center justify-center rounded-full text-(--oa-text-body) transition-colors hover:bg-(--oa-surface) disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      aria-current={p === current ? 'page' : undefined}
                      className={cn(
                        'flex size-8 items-center justify-center rounded-full text-[12px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25',
                        // Tint, not a solid fill: Create course is the only solid button on the page
                        p === current ? 'bg-(--oa-primary-50) text-(--oa-primary-strong)' : 'text-(--oa-text-secondary) hover:bg-(--oa-surface)',
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label="Next page"
                    onClick={() => setPage(Math.min(totalPages, current + 1))}
                    disabled={current === totalPages}
                    className="flex size-8 items-center justify-center rounded-full text-(--oa-text-body) transition-colors hover:bg-(--oa-surface) disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--oa-primary)/25"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

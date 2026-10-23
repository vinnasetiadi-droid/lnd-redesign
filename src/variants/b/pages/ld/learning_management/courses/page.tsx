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
  GraduationCap,
  LayoutGrid,
  List,
  Plus,
} from '@/variants/b/icons';
import { cn } from '@/lib/utils';
import { matchesOwnership, useCurrentUserName, type OwnershipFilter } from '../components/OwnershipTabs';
import { DashboardLayout } from '@/variants/b/layouts/DashboardLayout';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { CourseCard } from './components/CourseCard';
import { CourseLibraryTable, courseMode, courseType, ownerName, type CourseRow } from './components/CourseLibraryTable';
import { COURSES_MOCK, COURSE_STATUS_META, NOT_LIVE, draftItemsOf, type CourseItem, type CourseStatus } from './data/courses.mock';
import { IconCircle, NumText, PillButton, SearchField } from '@/variants/b/components/ui/kit';
import { FilterChip } from './components/FilterChip';
import { Pagination } from '@/variants/b/components/ui/pagination';
import { ProgramScopeTabs, type ScopeTab } from '@/variants/b/pages/ld/dashboard/components/ProgramScopeTabs';
import { daysUntil, timeAgo } from '@/variants/b/pages/ld/dashboard/period';
import { revealContainer, revealItem } from '@/variants/b/motion';

const PAGE_SIZE = 8;

type StatusFilter = 'all' | CourseStatus;
type TypeFilter = 'all' | 'Compliance' | 'Skill training';
type ModeFilter = 'all' | 'Blended' | 'Self-paced';
type SortKey = 'updated' | 'name' | 'enrolled';

/** The viewer's list/grid choice; storage can be blocked, so every access is guarded */
const VIEW_KEY = 'ob-upskill-studio-view';
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


/** Section rule: edge to edge, like Home. Lines inside a section use --ob-border-subtle */
function Rule() {
  return <div className="h-px bg-(--ob-border)" aria-hidden />;
}

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
    <DashboardLayout whitePage>
      {/* Home's style: sections on the white page, split by hairlines, no frames */}
      <motion.div className="ob-flat relative -mx-6 -mt-6 flex min-w-0 flex-col" variants={revealContainer} initial="hidden" animate="visible">
        {/* ── Header: one primary (blue) action ── */}
        <motion.div variants={revealItem} className="flex flex-wrap items-center justify-between gap-4 px-8 pt-10 pb-8">
          <div>
            <h1 className="text-[24px] leading-[32px] text-(--ob-text-strong)">Upskill Studio</h1>
            <p className="mt-0.5 text-[13px] text-(--ob-text-muted)">Create, review and assign courses for your teams</p>
          </div>
          <PillButton variant="primary" icon={Plus} onClick={() => navigate('/ld/learning-management/courses/create-offline')}>
            Create course
          </PillButton>
        </motion.div>

        <Rule />

        {/* ── Review queue: a hairline section with a 2px orange rule on the left (it waits on you),
              only when there is something to review ── */}
        {reviewQueue.length > 0 && (
          <motion.div variants={revealItem} className="relative flex items-center gap-4 px-8 py-5">
            <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 bg-(--ob-attention-bar)" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] leading-[20px] text-(--ob-text-strong)">
                {reviewQueue.length} {reviewQueue.length === 1 ? 'course' : 'courses'} waiting for your review
              </p>
              <p className="truncate text-[12px] leading-[16px] text-(--ob-text-muted)">
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
        {reviewQueue.length > 0 && <Rule />}

        {/* ── Library ── */}
        <motion.div ref={libraryRef} variants={revealItem} className="flex scroll-mt-3 flex-col gap-5 px-8 pt-10 pb-8">
          {/* Title on the left, status tabs beside it (the counts are the filter); tabs scroll sideways when narrow */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <h3 className="text-[18px] leading-[26px] text-(--ob-text-strong)">Course library</h3>
              <p className="mt-0.5 text-[13px] leading-[18px] text-(--ob-text-muted)"><NumText>{`${rows.length} ${rows.length === 1 ? 'course' : 'courses'}`}</NumText></p>
            </div>
            <div className="-mx-1 min-w-0 max-w-full overflow-x-auto px-1 [scrollbar-width:none]">
              <ProgramScopeTabs id="course-status" value={status} onChange={reset(setStatus)} tabs={tabs} />
            </div>
          </div>

          {/* One row of filters: a flat bar between two hairlines, its parts split by hairlines */}
          <div className="flex flex-wrap items-stretch border-y border-(--ob-border-subtle)">
            <SearchField
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              placeholder="Search courses"
              loading={isSearching}
              variant="bar"
              className="min-w-[200px] flex-1 max-md:basis-full max-md:border-b max-md:border-(--ob-border-subtle)"
            />

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

            {/* View: list by default, grid to browse; the picked one outlined in blue */}
            <div className="ml-auto flex items-center gap-1 border-l border-(--ob-border-subtle) px-2">
              {([['list', List, 'List view'], ['grid', LayoutGrid, 'Grid view']] as const).map(([m, Icon, label]) => (
                <button
                  key={m}
                  type="button"
                  aria-label={label}
                  aria-pressed={viewMode === m}
                  onClick={() => setViewMode(m)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-(--ob-radius-control) bg-(--ob-white) transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/25',
                    viewMode === m ? 'text-(--ob-primary-strong) ring-1 ring-inset ring-(--ob-primary)' : 'text-(--ob-text-subtle) hover:text-(--ob-text-body)',
                  )}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Courses */}
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <IconCircle icon={GraduationCap} className="size-10" />
              <p className="text-[13px] text-(--ob-text-muted)">
                {EMPTY_TEXT[status]}{filtersActive ? ' match these filters' : ''}
              </p>
              {filtersActive && <PillButton onClick={clearFilters}>Clear filters</PillButton>}
            </div>
          ) : viewMode === 'list' ? (
            <CourseLibraryTable rows={paginated} me={me} onOpen={openCourse} sort={sort} onSort={reset(setSort)} />
          ) : (
            /* A hairline grid: every cell has a line on its right and bottom; the wrapper clips the
               outer ones, so only lines between cells show. Pulled out by the cell padding, so
               the photos line up with the section's content edge, and up to the toolbar's
               bottom line, so the lines between cells meet it. */
            <div className="-mx-5 -mt-5 overflow-hidden">
              {/* 4 columns from 1440px (90rem), 3 from 1024px, 2 from 768px, 1 below: the meta row always fits */}
              <div className="-mb-px -mr-px grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-[90rem]:grid-cols-4">
                {paginated.map((row) => (
                  <CourseCard
                    key={row.key}
                    course={row.shown}
                    me={me}
                    onClick={() => openCourse(row.shown.id)}
                    className="border-b border-r border-(--ob-border-subtle)"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {rows.length > 0 && (
            <div className="flex items-center justify-between border-t border-(--ob-border-subtle) pt-4">
              <p className="text-[12px] text-(--ob-text-muted)">
                Showing {(current - 1) * PAGE_SIZE + 1} to {Math.min(current * PAGE_SIZE, rows.length)} of {rows.length} courses
              </p>
              {totalPages > 1 && <Pagination page={current} total={totalPages} onPage={setPage} />}
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

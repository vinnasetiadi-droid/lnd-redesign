// ============================================================
// Courses Listing Page — Upskill Studio
// Route: /ld/learning-management/courses
// ============================================================

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutGrid,
  List,
  BookOpen,
  Loader2,
} from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import { OwnershipTabs, matchesOwnership, useCurrentUserName, type OwnershipFilter } from '../components/OwnershipTabs';
import { DashboardLayout } from '@/variants/a/layouts/DashboardLayout';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { CourseCard } from './components/CourseCard';
import { CourseTable } from './components/CourseTable';
import {
  type CourseFilter,
} from './components/CourseFilterTabs';
import { COURSES_MOCK, COURSE_STATS } from './data/courses.mock';
import { PendingApprovalSection } from '@/variants/a/pages/hr/learning-management/components/PendingApprovalSection';
import { PENDING_APPROVAL_COURSES } from '@/variants/a/pages/hr/learning-management/data/course.mock';
import { latestVersionOf } from '@/lib/latestVersion';
import { CardHeader, IconCircle, PillButton } from '@/variants/a/components/ui/kit';
import { ADMIN_COURSE_VERSIONS } from './data/courses.mock';

const PAGE_SIZE = 9;

/** Course status counts, each with its status colour */
const STATUS_CARDS = [
  { label: 'On Draft',         key: 'onDraft',         dot: '#A4A7AE' },
  { label: 'Waiting Approval', key: 'waitingApproval', dot: '#FDB022' },
  { label: 'Need Revision',    key: 'needRevision',    dot: '#F97066' },
  { label: 'Approved',         key: 'approved',        dot: '#12B76A' },
  { label: 'Active',           key: 'active',          dot: '#1A73E8' },
  { label: 'Inactive',         key: 'inactive',        dot: '#D0D5DD' },
] as const;

/** Pill select, chevron drawn as a background image */
const SELECT_CLASS =
  "appearance-none h-9 pl-4 pr-9 rounded-full bg-[#F5F6F8] text-[13px] text-[#181D27] outline-none cursor-pointer transition-colors hover:bg-[#EDEEF1] focus-visible:ring-2 focus-visible:ring-[#1A73E8]/25 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23717680%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, type: 'spring', stiffness: 120, damping: 18 },
  }),
};

export default function CoursesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CourseFilter>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'compliance' | 'skill-training'>('all');
  const [search, setSearch] = useState('');
  const me = useCurrentUserName();
  const [ownerFilter, setOwnerFilter] = useState<OwnershipFilter>('all');
  const isSearching = useSimulatedLoading(search);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let result = COURSES_MOCK.filter((c) => matchesOwnership(c, ownerFilter, me));
    if (filter !== 'all') {
      result = result.filter((c) => c.status === filter);
    }
    if (typeFilter !== 'all') {
      result = result.filter((c) => {
        const isCompliance = c.category === 'Compliance';
        return typeFilter === 'compliance' ? isCompliance : !isCompliance;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q));
    }
    return result;
  }, [filter, typeFilter, search, ownerFilter, me]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (f: CourseFilter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col min-w-0 gap-3">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-end justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-[24px] leading-[32px] text-[#181D27]">Upskill Studio</h1>
            <p className="mt-0.5 text-[13px] text-[#717680]">
              Create, manage, and assign courses for team development.
            </p>
          </div>
          <PillButton
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/ld/learning-management/courses/create-offline')}
          >
            Create New Upskill
          </PillButton>
        </motion.div>

        {/* Status cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid grid-cols-3 xl:grid-cols-6 gap-3"
        >
          {STATUS_CARDS.map((stat) => (
            <div key={stat.label} className="rounded-[18px] bg-white p-4">
              <div className="flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full" style={{ background: stat.dot }} />
                <span className="truncate text-[13px] leading-[18px] text-[#535862]">{stat.label}</span>
              </div>
              <p className="mt-2 text-[24px] leading-[32px] text-[#181D27]">{COURSE_STATS[stat.key]}</p>
            </div>
          ))}
        </motion.div>

        {/* Pending Approval (courses only) */}
        {PENDING_APPROVAL_COURSES.filter((c) => c.type === 'course').length > 0 && (
          <PendingApprovalSection
            courses={PENDING_APPROVAL_COURSES.filter((c) => c.type === 'course')}
            routePrefix="/ld/learning-management/courses"
          />
        )}

        {/* Upskill Library card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-4 rounded-[18px] bg-white p-5"
        >
          <CardHeader title="Upskill Library" subtitle={`${filtered.length} upskills`} icon={BookOpen} />

          {/* Toolbar: ownership tabs, then search, view and filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <OwnershipTabs
              items={COURSES_MOCK}
              value={ownerFilter}
              onChange={(f) => {
                setOwnerFilter(f);
                setPage(1);
              }}
              me={me}
            />

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-[220px]">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#717680]" />
                <input
                  type="text"
                  placeholder="Search upskills"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-9 rounded-full bg-[#F5F6F8] pl-10 pr-9 text-[13px] text-[#181D27] placeholder:text-[#A4A7AE] outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-[#1A73E8]/25"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#1A73E8] animate-spin" />
                )}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-0.5 rounded-full bg-[#F5F6F8] p-1">
                {([['grid', LayoutGrid, 'Grid view'], ['list', List, 'List view']] as const).map(([mode, Icon, label]) => (
                  <button
                    key={mode}
                    type="button"
                    aria-label={label}
                    aria-pressed={viewMode === mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      'flex size-7 items-center justify-center rounded-full transition-colors cursor-pointer',
                      viewMode === mode
                        ? 'bg-white text-[#181D27] shadow-[0_1px_2px_rgba(16,24,40,0.08),0_1px_3px_rgba(16,24,40,0.06)]'
                        : 'text-[#717680] hover:text-[#414651]',
                    )}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>

              <select value={filter} onChange={(e) => handleFilterChange(e.target.value as CourseFilter)} className={SELECT_CLASS}>
                <option value="all">All Upskills</option>
                <option value="on-draft">On Draft</option>
                <option value="waiting-approval">Waiting Approval</option>
                <option value="need-revision">Need Revision</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value as 'all' | 'compliance' | 'skill-training'); setPage(1); }}
                className={SELECT_CLASS}
              >
                <option value="all">All Type</option>
                <option value="compliance">Compliance</option>
                <option value="skill-training">Skill Training</option>
              </select>
            </div>
          </div>

          {/* Course grid/list */}
          {viewMode === 'grid' ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {paginated.map((course, i) => (
                <motion.div key={course.id} custom={i} variants={fadeUp}>
                  <CourseCard
                    course={course}
                    latestVersion={latestVersionOf(ADMIN_COURSE_VERSIONS, course.id)}
                    onClick={() => navigate(`/ld/learning-management/courses/overview/${course.id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <CourseTable
              courses={paginated}
              onCourseClick={(id) => navigate(`/ld/learning-management/courses/overview/${id}`)}
            />
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <IconCircle icon={GraduationCap} className="size-10" />
              <p className="text-[13px] text-[#717680]">No courses found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-[12px] text-[#717680]">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} courses
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous page"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex size-8 items-center justify-center rounded-full bg-[#F5F6F8] text-[#414651] transition-colors hover:bg-[#EDEEF1] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    aria-current={p === page ? 'page' : undefined}
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full text-[12px] transition-colors cursor-pointer',
                      p === page ? 'bg-[#111111] text-white' : 'text-[#535862] hover:bg-[#F5F6F8]',
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Next page"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex size-8 items-center justify-center rounded-full bg-[#F5F6F8] text-[#414651] transition-colors hover:bg-[#EDEEF1] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

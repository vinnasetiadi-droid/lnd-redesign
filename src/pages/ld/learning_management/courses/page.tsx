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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OwnershipTabs, matchesOwnership, useCurrentUserName, type OwnershipFilter } from '../components/OwnershipTabs';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { CourseCard } from './components/CourseCard';
import { CourseTable } from './components/CourseTable';
import {
  type CourseFilter,
} from './components/CourseFilterTabs';
import { COURSES_MOCK, COURSE_STATS } from './data/courses.mock';
import { PendingApprovalSection } from '@/pages/hr/learning-management/components/PendingApprovalSection';
import { PENDING_APPROVAL_COURSES } from '@/pages/hr/learning-management/data/course.mock';
import { latestVersionOf } from '@/lib/latestVersion';
import { ADMIN_COURSE_VERSIONS } from './data/courses.mock';

const PAGE_SIZE = 9;

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
      <div className="w-full flex flex-col min-w-0 overflow-hidden gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-[#181D27]">
              Upskill Studio
            </h1>
            <p className="text-[14px] text-[#717680] mt-1">
              Create, manage, and assign courses for team development.
            </p>
          </div>
          <button
            onClick={() => navigate('/ld/learning-management/courses/create-offline')}
            className="flex items-center gap-2 bg-[#0001FE] hover:brightness-[0.92] text-[#FDFDFD] px-5 py-2.5 rounded-[8px] transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="text-[14px]">
              Create New Upskill
            </span>
          </button>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-row items-stretch gap-2.5 bg-white rounded-xl border border-[#E9EAEB] p-2.5 p-[16px]"
        >
          {[
            { label: 'On Draft', value: COURSE_STATS.onDraft, color: 'bg-[#A4A7AE]' },
            { label: 'Waiting Approval', value: COURSE_STATS.waitingApproval, color: 'bg-[#FDB022]' },
            { label: 'Need Revision', value: COURSE_STATS.needRevision, color: 'bg-[#F97066]' },
            { label: 'Approved', value: COURSE_STATS.approved, color: 'bg-[#12B76A]' },
            { label: 'Active', value: COURSE_STATS.active, color: 'bg-[#1570EF]' },
            { label: 'Inactive', value: COURSE_STATS.inactive, color: 'bg-[#D5D7DA]' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex-1 flex flex-col items-center justify-between bg-[#FAFAFA] rounded-lg py-3.5 px-[16px] py-[20px]"
            >
              <span className="text-[28px] text-[#181D27]" style={{ fontWeight: 700 }}>
                {stat.value}
              </span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={cn('w-2 h-2 rounded-full shrink-0', stat.color)} />
                <span className="text-[13px] text-[#717680] whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
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

        {/* Course Library section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-5"
        >
          {/* Section header */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] border border-[#E9EAEB] bg-white flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#1570EF]" />
            </div>
            <h2 className="text-[#181D27]">
              Upskill Library
            </h2>
          </div>

          <OwnershipTabs
            items={COURSES_MOCK}
            value={ownerFilter}
            onChange={(f) => {
              setOwnerFilter(f);
              setPage(1);
            }}
            me={me}
          />

          {/* Filter + Search */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A4A7AE]" />
              <input
                type="text"
                placeholder="Search upskills"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-9 h-12 rounded-[8px] border border-[#E9EAEB] bg-[#FDFDFD] text-[14px] text-[#0A0D12] placeholder:text-[#A4A7AE] focus:outline-none focus:border-[#0A0D12] focus:ring-0 transition-colors"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1570EF] animate-spin" />
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex items-center bg-[#F5F5F5] rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer',
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-[#1570EF]'
                      : 'text-[#A4A7AE] hover:text-[#535862]',
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer',
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-[#1570EF]'
                      : 'text-[#A4A7AE] hover:text-[#535862]',
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value as CourseFilter)}
                className="appearance-none px-4 h-12 pr-8 rounded-[8px] border border-[#E9EAEB] bg-[#FDFDFD] text-[14px] text-[#0A0D12] focus:outline-none focus:border-[#0A0D12] focus:ring-0 transition-colors cursor-pointer hover:border-[#D5D7DA] bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
              >
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
                className="appearance-none px-4 h-12 pr-8 rounded-[8px] border border-[#E9EAEB] bg-[#FDFDFD] text-[14px] text-[#0A0D12] focus:outline-none focus:border-[#0A0D12] focus:ring-0 transition-colors cursor-pointer hover:border-[#D5D7DA] bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
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
              className="grid grid-cols-3 gap-4"
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
              <div className="w-12 h-12 rounded-[10px] border border-[#E9EAEB] bg-white flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#1570EF]" />
              </div>
              <p className="text-[14px] text-[#717680]">No courses found matching your criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-[12px] text-[#717680]">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} courses
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E9EAEB] text-[#717680] disabled:opacity-40 hover:bg-[#FAFAFA] transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-md text-[12px] transition-colors cursor-pointer',
                      p === page
                        ? 'bg-[#0001FE] text-white'
                        : 'text-[#717680] hover:bg-[#FAFAFA]',
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E9EAEB] text-[#717680] disabled:opacity-40 hover:bg-[#FAFAFA] transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
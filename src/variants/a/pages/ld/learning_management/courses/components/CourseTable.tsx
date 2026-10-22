// ============================================================
// Courses Listing — Table / List View
// Columns: Thumbnail | Title | Type | Level | Learning Mode | Created By | Trainees | Duration | Status | Quick Action
// ============================================================

import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, MoreHorizontal, EyeOff, Trash2, AlertTriangle, X } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import type { CourseItem, CourseStatus } from '../data/courses.mock';
import { motion } from 'motion/react';
import { CreatorDisplay } from './CreatorDisplay';
import { StatusBadge } from './CourseStatus';

interface CourseTableProps {
  courses: CourseItem[];
  onCourseClick: (courseId: string) => void;
  className?: string;
  pageSize?: number;
}

type SortKey = 'title' | 'type' | 'level' | 'learningMode' | 'creator' | 'trainees' | 'duration' | 'status';
type SortDir = 'asc' | 'desc';


interface ColumnDef {
  key: SortKey | 'thumbnail' | 'action';
  label: string;
  sortable: boolean;
  width: string;
  align?: 'left' | 'center' | 'right';
}

const COLUMNS: ColumnDef[] = [
  { key: 'thumbnail', label: '', sortable: false, width: 'w-[72px]' },
  { key: 'title', label: 'Title', sortable: true, width: 'min-w-[180px] max-w-[240px]' },
  { key: 'type', label: 'Type', sortable: true, width: 'w-[120px]' },
  { key: 'level', label: 'Level', sortable: true, width: 'w-[100px]' },
  { key: 'learningMode', label: 'Learning Mode', sortable: true, width: 'w-[140px]' },
  { key: 'creator', label: 'Created By', sortable: true, width: 'w-[130px]' },
  { key: 'trainees', label: 'Trainees', sortable: true, width: 'w-[90px]' },
  { key: 'duration', label: 'Duration', sortable: true, width: 'w-[90px]' },
  { key: 'status', label: 'Status', sortable: true, width: 'w-[140px]' },
  { key: 'action', label: '', sortable: false, width: 'w-[140px]', align: 'center' },
];

function getCourseType(course: CourseItem): string {
  return course.category === 'Compliance' ? 'Compliance' : 'Skill Training';
}

export function CourseTable({ courses, onCourseClick = () => {}, className, pageSize }: CourseTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [inactiveConfirmId, setInactiveConfirmId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...courses].sort((a, b) => {
    if (!sortKey) return 0;
    const dir = sortDir === 'asc' ? 1 : -1;
    switch (sortKey) {
      case 'title':
        return dir * a.title.localeCompare(b.title);
      case 'type':
        return dir * getCourseType(a).localeCompare(getCourseType(b));
      case 'level':
        return dir * a.level.localeCompare(b.level);
      case 'learningMode':
        return dir * a.learningType.localeCompare(b.learningType);
      case 'duration':
        return dir * (a.duration ?? '').localeCompare(b.duration ?? '');
      case 'creator':
        return dir * (a.creator ?? '').localeCompare(b.creator ?? '');
      case 'trainees':
        return dir * ((a.trainees ?? 0) - (b.trainees ?? 0));
      case 'status':
        return dir * a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  function SortIcon({ col }: { col: string }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-[#E4E6EA]" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-[#414651]" />
      : <ArrowDown className="w-3 h-3 text-[#414651]" />;
  }

  const confirmCourse = inactiveConfirmId ? courses.find(c => c.id === inactiveConfirmId) : null;
  const deleteCourse = deleteConfirmId ? courses.find(c => c.id === deleteConfirmId) : null;

  return (
    <>
    <div className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <colgroup>
            {COLUMNS.map((col) => (
              <col key={col.key} className={col.width} />
            ))}
          </colgroup>

          <thead>
            <tr className="bg-[#F7F8FA]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-[10px] text-[12px] text-[#717680] whitespace-nowrap first:rounded-l-[12px] last:rounded-r-[12px]",
                    col.align === 'center' ? 'text-center' : 'text-left',
                    col.sortable && 'cursor-pointer select-none hover:text-[#414651] transition-colors',
                  )}
                  onClick={() => col.sortable && handleSort(col.key as SortKey)}
                >
                  {col.label ? (
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.sortable && <SortIcon col={col.key} />}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sorted.map((course, idx) => {

              return (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.025, type: 'spring', stiffness: 220, damping: 24 }}
                  className="border-b border-[#F0F1F3] hover:bg-[#F9FAFB] transition-colors group"
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-[#F5F6F8]">
                      <ImageWithFallback
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-normal text-[#252B37] truncate" title={course.title}>
                      {course.title}
                    </p>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-normal text-[#252B37] whitespace-nowrap">
                      {getCourseType(course)}
                    </span>
                  </td>

                  {/* Level */}
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-normal text-[#252B37] whitespace-nowrap">
                      {course.level}
                    </span>
                  </td>

                  {/* Learning Mode */}
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-normal text-[#252B37] whitespace-nowrap">
                      {course.learningType}
                    </span>
                  </td>

                  {/* Created By */}
                  <td className="px-4 py-3">
                    {course.creator ? (
                      <CreatorDisplay
                        creator={course.creator}
                        className="text-[13px] font-normal text-[#252B37] whitespace-nowrap"
                      />
                    ) : (
                      <span className="text-[13px] font-normal text-[#252B37]">-</span>
                    )}
                  </td>

                  {/* Trainees */}
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-normal text-[#252B37] whitespace-nowrap">
                      {course.trainees ?? 0}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-normal text-[#252B37] whitespace-nowrap">
                      {course.duration ?? '-'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={course.status} />
                  </td>

                  {/* Quick Action */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === course.id ? null : course.id); }}
                          className="flex size-8 items-center justify-center rounded-full hover:bg-[#F5F6F8] transition-colors text-[#717680]"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenuId === course.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-[14px] shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)] p-1 min-w-[170px]">
                              <button
                                type="button"
                                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#414651] hover:bg-[#F5F6F8] transition-colors"
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); onCourseClick(course.id); }}
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              {(() => {
                                const cIsActive = course.status === 'active';
                                const cIsInactive = course.status === 'inactive';
                                const cCanToggle = cIsActive || cIsInactive;
                                return (
                                  <button
                                    type="button"
                                    disabled={!cCanToggle}
                                    className={cn(
                                      'w-full flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] transition-colors',
                                      cCanToggle ? 'text-[#414651] hover:bg-[#F5F6F8] cursor-pointer' : 'text-[#D0D5DD] cursor-not-allowed',
                                    )}
                                    onClick={(e) => { e.stopPropagation(); if (cCanToggle) { setOpenMenuId(null); setInactiveConfirmId(course.id); } }}
                                  >
                                    {cIsInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    {cIsInactive ? 'Activate' : 'Deactivate'}
                                  </button>
                                );
                              })()}
                              <button
                                type="button"
                                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-[#D92D20] hover:bg-[#FEF3F2] transition-colors"
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); setDeleteConfirmId(course.id); }}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
            {pageSize && sorted.length < pageSize &&
              Array.from({ length: pageSize - sorted.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="pointer-events-none border-b border-[#F0F1F3]">
                  <td colSpan={COLUMNS.length} className="px-4 py-3">
                    <div className="h-9 invisible" />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>

    {/* Status Toggle Confirmation Modal */}
    {confirmCourse && (() => {
      const cIsActive = confirmCourse.status === 'active';
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(16,24,40,0.5)' }}>
          <div className="relative w-[460px] bg-[#FDFDFD] rounded-[20px] shadow-[0_24px_48px_-12px_rgba(16,24,40,0.18)] p-8 flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setInactiveConfirmId(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#717680] hover:bg-[#F5F6F8] transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-[#FFFAEB] flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7 text-[#D97706]" />
            </div>
            <h3 className="text-[16px] text-[#181D27]">
              {cIsActive ? 'Set course to inactive?' : 'Set course to active?'}
            </h3>
            {cIsActive ? (
              <div className="flex flex-col gap-2 mt-3 text-left w-full">
                <p className="text-[12px] text-[#535862] leading-[20px] flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                  Only currently enrolled trainees will retain access.
                </p>
                <p className="text-[12px] text-[#535862] leading-[20px] flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                  New trainees will not be able to view or enroll in this course.
                </p>
                <p className="text-[12px] text-[#535862] leading-[20px] flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                  Other collaborators will be notified of this change.
                </p>
              </div>
            ) : (
              <p className="text-[13px] text-[#535862] mt-2">
                This will reactivate <span className="text-[#181D27]">"{confirmCourse.title}"</span>. New trainees will be able to view and enroll in this course again.
              </p>
            )}
            <div className="flex gap-3 w-full mt-6">
              <button onClick={() => setInactiveConfirmId(null)} className="flex-1 h-10 rounded-full bg-[#F0F1F3] hover:bg-[#E6E8EB] text-[13px] text-[#414651] hover:bg-[#F5F6F8] cursor-pointer transition-colors">Cancel</button>
              <button onClick={() => setInactiveConfirmId(null)} className={cn('flex-1 h-10 rounded-full text-[13px] text-white hover:brightness-[0.92] cursor-pointer transition-colors', cIsActive ? 'bg-[#D97706]' : 'bg-[#1A73E8]')}>
                {cIsActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      );
    })()}

    {/* Delete Confirmation Modal */}
    {deleteCourse && (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(16,24,40,0.5)' }}>
        <div className="relative w-[460px] bg-[#FDFDFD] rounded-[20px] shadow-[0_24px_48px_-12px_rgba(16,24,40,0.18)] p-8 flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setDeleteConfirmId(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#717680] hover:bg-[#F5F6F8] transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="w-14 h-14 rounded-full bg-[#FEF3F2] flex items-center justify-center mb-5">
            <Trash2 className="w-7 h-7 text-[#D92D20]" />
          </div>
          <h3 className="text-[16px] text-[#181D27]">
            Are you sure you want to delete this course?
          </h3>
          <div className="flex flex-col gap-2 mt-3 text-left w-full">
            <p className="text-[12px] text-[#535862] leading-[20px] flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D92D20] shrink-0" />
              This action cannot be undone and all content within <span className="text-[#181D27]">"{deleteCourse.title}"</span> will be permanently removed.
            </p>
            <p className="text-[12px] text-[#535862] leading-[20px] flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#D92D20] shrink-0" />
              Other collaborators will be notified of this change.
            </p>
          </div>
          <div className="flex gap-3 w-full mt-6">
            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 h-10 rounded-full bg-[#F0F1F3] hover:bg-[#E6E8EB] text-[13px] text-[#414651] hover:bg-[#F5F6F8] cursor-pointer transition-colors">Cancel</button>
            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 h-10 rounded-full bg-[#D92D20] text-[13px] text-white hover:brightness-[0.92] cursor-pointer transition-colors">Delete</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { STATUS_CHIP_CLASS, STATUS_LABEL, type CourseLifecycleStatus } from '@/lib/courseActions';
import { Eye, MoreHorizontal, EyeOff, Eye as EyeOn, Trash2, AlertTriangle, X } from '@/variants/a/icons';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import type { CourseItem, CourseStatus } from '../data/courses.mock';
import { ADMIN_COURSE_VERSIONS, NOT_LIVE } from '../data/courses.mock';
import { CreatorDisplay } from './CreatorDisplay';
import { DeleteVersionDialog } from '@/variants/a/components/common/DeleteVersionDialog';
import { StatusBadge } from './CourseStatus';

interface CourseCardProps {
  course: CourseItem;
  /** Highest version this course has reached. Anything unrevised is on 1. */
  latestVersion?: number;
  className?: string;
  onClick?: () => void;
}


export function CourseCard({ course, latestVersion, className, onClick }: CourseCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Only work that has never been published can be thrown away; anything
  // else is superseded by a new version instead.
  const canDelete = course.status === 'on-draft' || course.status === 'need-revision';

  const isActive = course.status === 'active';
  const isInactive = course.status === 'inactive';
  const canToggleStatus = isActive || isInactive;

  return (
    <div
      className={cn(
        'bg-[#F7F8FA] rounded-[14px] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_-8px_rgba(16,24,40,0.14)] hover:-translate-y-[2px] transition-all duration-200 group',
        className,
      )}
    >
      {/* Banner image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <ImageWithFallback
          src={course.image}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={course.status} onImage />
        </div>

        {/* Title + meta on image */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white text-[16px] leading-[24px] line-clamp-2">
            {course.title}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex flex-col gap-1.5 mt-auto">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[12px] text-[#717680] shrink-0">Type</span>
            <span className="text-[12px] text-[#414651] text-right">
              {course.category === 'Compliance' ? 'Compliance' : 'Skill training'}
            </span>
          </div>

          {course.level && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12px] text-[#717680] shrink-0">Level</span>
              <span className="text-[12px] text-[#414651] text-right">
                {course.level}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <span className="text-[12px] text-[#717680] shrink-0">Learning mode</span>
            <span className="text-[12px] text-[#414651] text-right">
              {course.learningType}
            </span>
          </div>

          {course.creator && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12px] text-[#717680] shrink-0">Created by</span>
              <CreatorDisplay
                creator={course.creator}
                className="text-[12px] text-[#414651]"
                iconSize="w-3.5 h-3.5"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <span className="text-[12px] text-[#717680] shrink-0">Trainees</span>
            <span className="text-[12px] text-[#414651] text-right">
              {NOT_LIVE.includes(course.status) ? 'Not live' : `${course.trainees ?? 0} enrolled`}
            </span>
          </div>


          <div className="flex items-center justify-between gap-4">
            <span className="text-[12px] text-[#717680] shrink-0">Latest version</span>
            <span className="text-[12px] text-[#414651] text-right">
              Version {latestVersion ?? 1}
            </span>
          </div>
          {course.duration && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12px] text-[#717680] shrink-0">Duration</span>
              <span className="text-[12px] text-[#414651] text-right">
                {course.duration}
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onClick}
            className="flex-1 flex items-center justify-center gap-2 h-9 rounded-full bg-white text-[#181D27] text-[13px] hover:bg-[#EDEEF1] transition-colors duration-200"
          >
            <Eye size={16} />
            View details
          </button>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              aria-label="More actions"
              className="flex items-center justify-center size-9 rounded-full bg-white text-[#414651] hover:bg-[#EDEEF1] transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 bottom-full mb-1 z-20 bg-white rounded-[14px] shadow-[0_8px_24px_-6px_rgba(16,24,40,0.18),0_2px_4px_rgba(16,24,40,0.04)] p-1 min-w-[170px]">
                  <button
                    type="button"
                    disabled={!canToggleStatus}
                    className={cn(
                      'w-full flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] transition-colors',
                      canToggleStatus ? 'text-[#414651] hover:bg-[#F5F6F8] cursor-pointer' : 'text-[#D0D5DD] cursor-not-allowed',
                    )}
                    onClick={(e) => { e.stopPropagation(); if (canToggleStatus) { setMenuOpen(false); setShowStatusConfirm(true); } }}
                  >
                    {isInactive ? <EyeOn className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {isInactive ? 'Activate' : 'Deactivate'}
                  </button>
                  <button
                    type="button"
                    disabled={!canDelete}
                    title={canDelete ? undefined : 'Only a draft or a version sent back for revision can be deleted.'}
                    className={cn(
                      'w-full flex items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] transition-colors',
                      canDelete ? 'text-[#D92D20] hover:bg-[#FEF3F2] cursor-pointer' : 'text-[#D0D5DD] cursor-not-allowed',
                    )}
                    onClick={(e) => { e.stopPropagation(); if (canDelete) { setMenuOpen(false); setShowDeleteConfirm(true); } }}
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

      <DeleteVersionDialog
        open={showDeleteConfirm}
        subject="course"
        name={course.title}
        version={latestVersion ?? 1}
        status={course.status as CourseLifecycleStatus}
        image={course.image}
        lastUpdate={course.updatedAt}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => setShowDeleteConfirm(false)}
      />

      {/* Status Toggle Confirmation Modal — portaled to body */}
      {showStatusConfirm && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(16,24,40,0.5)' }}>
          <div className="relative w-[460px] bg-[#FDFDFD] rounded-[20px] shadow-[0_24px_48px_-12px_rgba(16,24,40,0.18)] p-8 flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowStatusConfirm(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#717680] hover:bg-[#F5F6F8] transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-[#FFFAEB] flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7 text-[#D97706]" />
            </div>
            <h3 className="text-[16px] text-[#181D27]">
              {isActive ? 'Set course to inactive?' : 'Activate Course?'}
            </h3>
            {isActive ? (
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
                This will reactivate <span className="text-[#181D27]">"{course.title}"</span>. New trainees will be able to view and enroll in this course again.
              </p>
            )}
            <div className="flex gap-3 w-full mt-6">
              <button onClick={() => setShowStatusConfirm(false)} className="flex-1 h-10 rounded-full bg-[#F0F1F3] hover:bg-[#E6E8EB] text-[13px] text-[#414651] hover:bg-[#F5F6F8] cursor-pointer transition-colors">Cancel</button>
              <button onClick={() => setShowStatusConfirm(false)} className={cn('flex-1 h-10 rounded-full text-[13px] text-white hover:brightness-[0.92] cursor-pointer transition-colors', isActive ? 'bg-[#D97706]' : 'bg-[#1A73E8]')}>
                {isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

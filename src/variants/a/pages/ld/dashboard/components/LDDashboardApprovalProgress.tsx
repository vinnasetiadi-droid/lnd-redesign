import { useState } from 'react';
import { ClipboardCheck } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import type { CourseApproval, CourseApprovalStatus, ProgramApprovalType } from '../types/dashboard.types';

interface LDDashboardApprovalProgressProps {
  approvals: CourseApproval[];
  className?: string;
}

const STATUS_STYLES: Record<CourseApprovalStatus, { bg: string; text: string; dot: string }> = {
  'On Draft':              { bg: 'bg-(--oa-surface)',   text: 'text-(--oa-text-ink)',   dot: 'bg-(--oa-text-subtle)'   },
  'Waiting for Approval':  { bg: 'bg-(--oa-attention-track)',   text: 'text-(--oa-attention-text)',  dot: 'bg-(--oa-warning)'  },
  'Need Revision':         { bg: 'bg-(--oa-orange-surface)',  text: 'text-(--oa-orange-strong)', dot: 'bg-(--oa-orange)' },
  'Approved':              { bg: 'bg-(--oa-success-100)', text: 'text-(--oa-success-strong)',dot: 'bg-(--oa-success-bright)'},
  'Active':                { bg: 'bg-(--oa-primary-100)',    text: 'text-(--oa-primary-900)',   dot: 'bg-(--oa-primary-400)'   },
  'Inactive':              { bg: 'bg-(--oa-danger-100)',     text: 'text-(--oa-danger-strong)',    dot: 'bg-(--oa-danger-bright)'    },
  'Under Review':          { bg: 'bg-(--oa-attention-track)',   text: 'text-(--oa-attention-text)',  dot: 'bg-(--oa-warning)'  },
  'Pending Review':        { bg: 'bg-(--oa-attention-track)',   text: 'text-(--oa-attention-text)',  dot: 'bg-(--oa-warning)'  },
};

const TYPE_STYLES: Record<ProgramApprovalType, { bg: string; text: string; icon: string }> = {
  'Journey': { bg: 'bg-sky-50',     text: 'text-sky-700',     icon: '🗺️' },
  'Course':  { bg: 'bg-(--oa-primary-50)', text: 'text-(--oa-primary-strong)',  icon: '📘' },
};

const HIDDEN_STATUSES: CourseApprovalStatus[] = ['On Draft', 'Active', 'Inactive'];

export function LDDashboardApprovalProgress({ approvals, className }: LDDashboardApprovalProgressProps) {
  const [activeFilter, setActiveFilter] = useState<CourseApprovalStatus | 'All'>('All');

  const visible = approvals.filter((a) => !HIDDEN_STATUSES.includes(a.status));
  const filtered = activeFilter === 'All'
    ? visible
    : visible.filter((a) => a.status === activeFilter);

  return (
    <div className={cn('relative bg-(--oa-white) rounded-[18px] p-5 overflow-hidden', className)}>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-(--oa-primary-50)/50 to-(--oa-primary-100)/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-[10px] border border-(--oa-border) bg-(--oa-white) flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-6 h-6 text-(--oa-text-body)" strokeWidth={1.75} />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-(--oa-text-strong)">HR Approval Progress</h3>
            <p className="text-[13px] text-(--oa-text-muted)">Track program submission and approval status</p>
          </div>
        </div>

        {/* Status Filter Pills */}
        {/* Filter pills removed */}
      </div>

      {/* Table */}
      <div className="bg-(--oa-white) rounded-[12px] border border-(--oa-border) overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-(--oa-border) bg-(--oa-surface-subtle)">
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oa-text-muted) leading-[16px]">Program Name</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oa-text-muted) leading-[16px]">Type</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oa-text-muted) leading-[16px]">Approval ID</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oa-text-muted) leading-[16px]">Status</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oa-text-muted) leading-[16px]">Submission Date</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oa-text-muted) leading-[16px]">Latest Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const s = STATUS_STYLES[item.status];
                const t = TYPE_STYLES[item.programType];
                return (
                  <tr key={item.id} className="border-b border-(--oa-border) last:border-0 hover:bg-(--oa-surface-subtle) transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[13px] text-(--oa-text-heading) truncate max-w-[200px]">{item.programName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-(--oa-text-muted)">{item.programType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[12px] font-mono text-(--oa-text-muted) bg-(--oa-surface) px-2 py-0.5 rounded-[4px] whitespace-nowrap">{item.approvalId}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-[2px] rounded text-[12px] whitespace-nowrap', s.bg, s.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-(--oa-text-muted)">
                        {new Date(item.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] text-(--oa-text-body)">{item.latestActivity}</p>
                        <p className="text-[12px] text-(--oa-text-subtle)">{item.latestActivityTime}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-(--oa-text-subtle)">
                    No programs match this filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
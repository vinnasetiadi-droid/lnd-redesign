import { useState } from 'react';
import { ClipboardCheck } from '@/variants/b/icons';
import { cn } from '@/lib/utils';
import type { CourseApproval, CourseApprovalStatus, ProgramApprovalType } from '../types/dashboard.types';

interface LDDashboardApprovalProgressProps {
  approvals: CourseApproval[];
  className?: string;
}

const STATUS_STYLES: Record<CourseApprovalStatus, { bg: string; text: string; dot: string }> = {
  'On Draft':              { bg: 'bg-(--ob-surface)',   text: 'text-(--ob-text-ink)',   dot: 'bg-(--ob-text-subtle)'   },
  'Waiting for Approval':  { bg: 'bg-(--ob-attention-track)',   text: 'text-(--ob-attention-text)',  dot: 'bg-(--ob-attention-bar)'  },
  'Need Revision':         { bg: 'bg-(--ob-orange-surface)',  text: 'text-(--ob-orange-strong)', dot: 'bg-(--ob-orange)' },
  'Approved':              { bg: 'bg-(--ob-success-100)', text: 'text-(--ob-success-strong)',dot: 'bg-(--ob-success-bright)'},
  'Active':                { bg: 'bg-(--ob-primary-100)',    text: 'text-(--ob-primary-900)',   dot: 'bg-(--ob-primary-400)'   },
  'Inactive':              { bg: 'bg-(--ob-danger-100)',     text: 'text-(--ob-danger-strong)',    dot: 'bg-(--ob-danger-bright)'    },
  'Under Review':          { bg: 'bg-(--ob-attention-track)',   text: 'text-(--ob-attention-text)',  dot: 'bg-(--ob-attention-bar)'  },
  'Pending Review':        { bg: 'bg-(--ob-attention-track)',   text: 'text-(--ob-attention-text)',  dot: 'bg-(--ob-attention-bar)'  },
};

const TYPE_STYLES: Record<ProgramApprovalType, { bg: string; text: string; icon: string }> = {
  'Journey': { bg: 'bg-sky-50',     text: 'text-sky-700',     icon: '🗺️' },
  'Course':  { bg: 'bg-(--ob-primary-50)', text: 'text-(--ob-primary-strong)',  icon: '📘' },
};

const HIDDEN_STATUSES: CourseApprovalStatus[] = ['On Draft', 'Active', 'Inactive'];

export function LDDashboardApprovalProgress({ approvals, className }: LDDashboardApprovalProgressProps) {
  const [activeFilter, setActiveFilter] = useState<CourseApprovalStatus | 'All'>('All');

  const visible = approvals.filter((a) => !HIDDEN_STATUSES.includes(a.status));
  const filtered = activeFilter === 'All'
    ? visible
    : visible.filter((a) => a.status === activeFilter);

  return (
    <div className={cn('relative bg-white rounded-[18px] p-5 overflow-hidden', className)}>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-(--ob-primary-50)/50 to-(--ob-primary-100)/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-[10px] border border-(--ob-border) bg-white flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-6 h-6 text-(--ob-text-body)" strokeWidth={1.75} />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-(--ob-text-strong)">HR Approval Progress</h3>
            <p className="text-[13px] text-(--ob-text-muted)">Track program submission and approval status</p>
          </div>
        </div>

        {/* Status Filter Pills */}
        {/* Filter pills removed */}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-(--ob-border) overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-(--ob-border) bg-(--ob-surface-subtle)">
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--ob-text-muted) leading-[16px]">Program Name</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--ob-text-muted) leading-[16px]">Type</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--ob-text-muted) leading-[16px]">Approval ID</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--ob-text-muted) leading-[16px]">Status</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--ob-text-muted) leading-[16px]">Submission Date</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--ob-text-muted) leading-[16px]">Latest Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const s = STATUS_STYLES[item.status];
                const t = TYPE_STYLES[item.programType];
                return (
                  <tr key={item.id} className="border-b border-(--ob-border) last:border-0 hover:bg-(--ob-surface-subtle) transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[13px] text-(--ob-text-heading) truncate max-w-[200px]">{item.programName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-(--ob-text-muted)">{item.programType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[12px] font-mono text-(--ob-text-muted) bg-(--ob-surface) px-2 py-0.5 rounded-[4px] whitespace-nowrap">{item.approvalId}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-[2px] rounded text-[12px] whitespace-nowrap', s.bg, s.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-(--ob-text-muted)">
                        {new Date(item.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] text-(--ob-text-body)">{item.latestActivity}</p>
                        <p className="text-[12px] text-(--ob-text-subtle)">{item.latestActivityTime}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-(--ob-text-subtle)">
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
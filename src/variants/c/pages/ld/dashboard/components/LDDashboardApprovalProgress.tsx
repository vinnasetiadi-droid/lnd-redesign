import { useState } from 'react';
import { ClipboardCheck } from '@/variants/c/icons';
import { cn } from '@/lib/utils';
import type { CourseApproval, CourseApprovalStatus, ProgramApprovalType } from '../types/dashboard.types';

interface LDDashboardApprovalProgressProps {
  approvals: CourseApproval[];
  className?: string;
}

const STATUS_STYLES: Record<CourseApprovalStatus, { bg: string; text: string; dot: string }> = {
  'On Draft':              { bg: 'bg-(--oc-surface)',   text: 'text-(--oc-text-ink)',   dot: 'bg-(--oc-text-subtle)'   },
  'Waiting for Approval':  { bg: 'bg-(--oc-attention-track)',   text: 'text-(--oc-attention-text)',  dot: 'bg-(--oc-warning)'  },
  'Need Revision':         { bg: 'bg-(--oc-orange-surface)',  text: 'text-(--oc-orange-strong)', dot: 'bg-(--oc-orange)' },
  'Approved':              { bg: 'bg-(--oc-success-100)', text: 'text-(--oc-success-strong)',dot: 'bg-(--oc-success-bright)'},
  'Active':                { bg: 'bg-(--oc-primary-100)',    text: 'text-(--oc-primary-900)',   dot: 'bg-(--oc-primary-400)'   },
  'Inactive':              { bg: 'bg-(--oc-danger-100)',     text: 'text-(--oc-danger-strong)',    dot: 'bg-(--oc-danger-bright)'    },
  'Under Review':          { bg: 'bg-(--oc-attention-track)',   text: 'text-(--oc-attention-text)',  dot: 'bg-(--oc-warning)'  },
  'Pending Review':        { bg: 'bg-(--oc-attention-track)',   text: 'text-(--oc-attention-text)',  dot: 'bg-(--oc-warning)'  },
};

const TYPE_STYLES: Record<ProgramApprovalType, { bg: string; text: string; icon: string }> = {
  'Journey': { bg: 'bg-sky-50',     text: 'text-sky-700',     icon: '🗺️' },
  'Course':  { bg: 'bg-(--oc-primary-50)', text: 'text-(--oc-primary-strong)',  icon: '📘' },
};

const HIDDEN_STATUSES: CourseApprovalStatus[] = ['On Draft', 'Active', 'Inactive'];

export function LDDashboardApprovalProgress({ approvals, className }: LDDashboardApprovalProgressProps) {
  const [activeFilter, setActiveFilter] = useState<CourseApprovalStatus | 'All'>('All');

  const visible = approvals.filter((a) => !HIDDEN_STATUSES.includes(a.status));
  const filtered = activeFilter === 'All'
    ? visible
    : visible.filter((a) => a.status === activeFilter);

  return (
    <div className={cn('relative rounded-(--oc-radius-card) oc-surface p-5 overflow-hidden', className)}>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-(--oc-primary-50)/50 to-(--oc-primary-100)/50 rounded-(--oc-radius-chip) blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-(--oc-radius-control) border border-(--oc-border) bg-white flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-6 h-6 text-(--oc-text-body)" strokeWidth={1.75} />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-(--oc-text-strong)">HR Approval Progress</h3>
            <p className="text-[13px] text-(--oc-text-muted)">Track program submission and approval status</p>
          </div>
        </div>

        {/* Status Filter Pills */}
        {/* Filter pills removed */}
      </div>

      {/* Table */}
      <div className="bg-white rounded-(--oc-radius-card) border border-(--oc-border) overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-(--oc-border) bg-(--oc-surface-subtle)">
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oc-text-muted) leading-[16px]">Program Name</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oc-text-muted) leading-[16px]">Type</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oc-text-muted) leading-[16px]">Approval ID</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oc-text-muted) leading-[16px]">Status</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oc-text-muted) leading-[16px]">Submission Date</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-(--oc-text-muted) leading-[16px]">Latest Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const s = STATUS_STYLES[item.status];
                const t = TYPE_STYLES[item.programType];
                return (
                  <tr key={item.id} className="border-b border-(--oc-border) last:border-0 hover:bg-(--oc-surface-subtle) transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[13px] text-(--oc-text-heading) truncate max-w-[200px]">{item.programName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-(--oc-text-muted)">{item.programType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[12px] font-mono text-(--oc-text-muted) bg-(--oc-surface) px-2 py-0.5 rounded-[4px] whitespace-nowrap">{item.approvalId}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-[2px] rounded text-[12px] whitespace-nowrap', s.bg, s.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-(--oc-text-muted)">
                        {new Date(item.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] text-(--oc-text-body)">{item.latestActivity}</p>
                        <p className="text-[12px] text-(--oc-text-subtle)">{item.latestActivityTime}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-(--oc-text-subtle)">
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
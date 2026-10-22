import { useState } from 'react';
import { ClipboardCheck } from '@/variants/a/icons';
import { cn } from '@/lib/utils';
import type { CourseApproval, CourseApprovalStatus, ProgramApprovalType } from '../types/dashboard.types';

interface LDDashboardApprovalProgressProps {
  approvals: CourseApproval[];
  className?: string;
}

const STATUS_STYLES: Record<CourseApprovalStatus, { bg: string; text: string; dot: string }> = {
  'On Draft':              { bg: 'bg-[#F5F6F8]',   text: 'text-[#0A0D12]',   dot: 'bg-[#A4A7AE]'   },
  'Waiting for Approval':  { bg: 'bg-[#FEF0C7]',   text: 'text-[#B54708]',  dot: 'bg-[#FDB022]'  },
  'Need Revision':         { bg: 'bg-[#FFEAD5]',  text: 'text-[#C4320A]', dot: 'bg-[#FB6514]' },
  'Approved':              { bg: 'bg-[#D1FADF]', text: 'text-[#027A48]',dot: 'bg-[#32D583]'},
  'Active':                { bg: 'bg-[#D2E3FC]',    text: 'text-[#174EA6]',   dot: 'bg-[#669DF6]'   },
  'Inactive':              { bg: 'bg-[#FEE4E2]',     text: 'text-[#B42318]',    dot: 'bg-[#F97066]'    },
  'Under Review':          { bg: 'bg-[#FEF0C7]',   text: 'text-[#B54708]',  dot: 'bg-[#FDB022]'  },
  'Pending Review':        { bg: 'bg-[#FEF0C7]',   text: 'text-[#B54708]',  dot: 'bg-[#FDB022]'  },
};

const TYPE_STYLES: Record<ProgramApprovalType, { bg: string; text: string; icon: string }> = {
  'Journey': { bg: 'bg-sky-50',     text: 'text-sky-700',     icon: '🗺️' },
  'Course':  { bg: 'bg-[#E8F0FE]', text: 'text-[#1967D2]',  icon: '📘' },
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
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#E8F0FE]/50 to-[#D2E3FC]/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-[10px] border border-[#EDEEF1] bg-white flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-6 h-6 text-[#414651]" strokeWidth={1.75} />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-[#181D27]">HR Approval Progress</h3>
            <p className="text-[13px] text-[#717680]">Track program submission and approval status</p>
          </div>
        </div>

        {/* Status Filter Pills */}
        {/* Filter pills removed */}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[12px] border border-[#EDEEF1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EDEEF1] bg-[#F9FAFB]">
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px]">Program Name</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px]">Type</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px]">Approval ID</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px]">Status</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px]">Submission Date</th>
                <th className="px-4 py-2.5 text-[12px] font-normal text-[#717680] leading-[16px]">Latest Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const s = STATUS_STYLES[item.status];
                const t = TYPE_STYLES[item.programType];
                return (
                  <tr key={item.id} className="border-b border-[#EDEEF1] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[13px] text-[#252B37] truncate max-w-[200px]">{item.programName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-[#717680]">{item.programType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[12px] font-mono text-[#717680] bg-[#F5F6F8] px-2 py-0.5 rounded-[4px] whitespace-nowrap">{item.approvalId}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 px-2 py-[2px] rounded text-[12px] whitespace-nowrap', s.bg, s.text)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-[#717680]">
                        {new Date(item.submissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] text-[#414651]">{item.latestActivity}</p>
                        <p className="text-[12px] text-[#A4A7AE]">{item.latestActivityTime}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-[#A4A7AE]">
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
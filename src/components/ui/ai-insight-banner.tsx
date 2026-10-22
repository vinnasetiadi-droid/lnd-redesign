import { cn } from "@/lib/utils";

interface AIInsightBannerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standardised AI Insight Analysis banner.
 * Style: gradient indigo-purple bg, soft indigo border,
 * sparkle icon with shadow, uppercase title with pulsing dot.
 */
export function AIInsightBanner({
  children,
  className,
}: AIInsightBannerProps) {
  return (
    <div
      className={cn(
        "relative rounded-[12px] bg-gradient-to-br from-[#EEF4FF]/50 via-[#F4F3FF]/30 to-white p-4 border border-[#C7D7FE]/50 shadow-sm overflow-hidden",
        className,
      )}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#E0EAFF]/40 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
      <div className="relative flex gap-3 items-start">
        {/* Icon */}
        <div className="shrink-0 p-2 bg-white rounded-[8px] shadow-[0_2px_8px_rgba(68,76,231,0.15)] border border-[#EEF4FF] text-[#444CE7]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[10px] text-[#2D3282] uppercase tracking-widest">
              AI Insight Analysis
            </h4>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
          </div>
          <p className="text-[12px] text-[#535862] leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
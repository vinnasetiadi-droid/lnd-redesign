import { useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/variants/a/icons";
import { NisaOrb } from "./NisaOrb";

interface AIInsightBannerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standardised AI Insight Analysis banner.
 * Style: white to light blue gradient, no border, no icon.
 */
export function AIInsightBanner({
  children,
  className,
}: AIInsightBannerProps) {
  return (
    <div
      className={cn(
        "relative rounded-[14px] bg-gradient-to-br from-white via-[#F5F9FE] to-[#E8F0FE] p-4 overflow-hidden",
        className,
      )}
    >

      <div className="relative">
        {/* Content */}
        <div className="min-w-0">
          <h4 className="mb-1 text-[12px] text-[#1967D2]">AI Insight Analysis</h4>
          <p className="text-[13px] text-[#414651] leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
/**
 * One-line NISA insight under a chart: blob, truncated text (full text on
 * hover) and an "Ask NISA" link. Narrow cards can allow two lines.
 */
export function AIInsightLine({ text, fullText, lines = 1, className }: { text: string; fullText?: string; lines?: 1 | 2; className?: string }) {
  // The light sweep plays once, when the row first scrolls into view
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  return (
    <div ref={ref} className={cn("flex items-center gap-3 rounded-[14px] bg-[#F5F9FE] px-4 py-3", inView && "oa-sweep", className)}>
      <NisaOrb size={20} />
      <p className={cn("min-w-0 flex-1 text-[13px] leading-[18px] text-[#282828]", lines === 2 ? "line-clamp-2" : "truncate")} title={fullText ?? text}>
        {text}
      </p>
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1 text-[13px] text-[#1A73E8] transition-colors hover:text-[#1967D2] cursor-pointer"
      >
        Ask NISA
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

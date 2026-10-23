import { cn } from "@/lib/utils";
import { ArrowRight } from "@/variants/b/icons";

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
        "relative rounded-(--ob-radius-card) bg-gradient-to-br from-white via-(--ob-primary-tint) to-(--ob-primary-50) p-4 overflow-hidden",
        className,
      )}
    >

      <div className="relative">
        {/* Content */}
        <div className="min-w-0">
          <h4 className="mb-1 text-[12px] text-(--ob-primary-strong)">AI Insight Analysis</h4>
          <p className="text-[13px] text-(--ob-text-body) leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
/**
 * Option B NISA insight line: no box and no orb. A 2px blue rule on the left,
 * a small "NISA" label, then the sentence in strong text (up to two lines,
 * the full text on hover) with "Ask NISA" as a link at its end. `lines`
 * stays for callers; the sentence may always wrap to two lines.
 */
export function AIInsightLine({ text, fullText, className }: { text: string; fullText?: string; lines?: 1 | 2; className?: string }) {
  return (
    <div className={cn("border-l-2 border-(--ob-primary) pl-3", className)}>
      <p className="ob-tracked text-[11px] leading-[16px] font-medium text-(--ob-primary-strong)">NISA</p>
      <p className="mt-0.5 line-clamp-2 text-[13px] leading-[20px] text-(--ob-text-strong)" title={fullText ?? text}>
        {text}{" "}
        <button
          type="button"
          className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-(--ob-radius-control) align-baseline text-(--ob-primary) transition-colors hover:text-(--ob-primary-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ob-primary)/25 cursor-pointer"
        >
          Ask NISA
          <ArrowRight size={13} className="self-center" />
        </button>
      </p>
    </div>
  );
}

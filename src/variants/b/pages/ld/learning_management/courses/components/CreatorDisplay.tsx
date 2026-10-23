// ============================================================
// CreatorDisplay — Shows creator name with platform logo if applicable
// ============================================================

import { cn } from '@/lib/utils';
import { User } from '@/variants/b/icons';

interface CreatorDisplayProps {
  creator: string;
  className?: string;
  showIcon?: boolean;
  iconSize?: string;
}

/** LinkedIn SVG logo */
const LinkedInLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

function isLinkedIn(creator: string): boolean {
  return creator.toLowerCase().trim() === 'linkedin';
}

export function CreatorDisplay({
  creator,
  className,
  showIcon = true,
  iconSize = 'w-3.5 h-3.5',
}: CreatorDisplayProps) {
  const isLI = isLinkedIn(creator);

  return (
    <span className={cn('inline-flex items-center gap-1.5 min-w-0', className)}>
      {showIcon && (
        isLI ? (
          <span
            className={cn('shrink-0 flex items-center justify-center', iconSize)}
            style={{ color: 'var(--ob-brand-linkedin)' }}
          >
            <LinkedInLogo className="w-full h-full" />
          </span>
        ) : (
          <User className={cn('text-(--ob-text-subtle) shrink-0', iconSize)} />
        )
      )}
      <span className="truncate">{creator}</span>
    </span>
  );
}

import { useEffect, useRef, useState } from 'react';

/**
 * Simulates a brief loading state whenever the watched value changes.
 *
 * Useful for giving the user feedback that an action (search input, filter
 * change, etc.) is "loading" data — even though the demo backend returns
 * results synchronously. The first render is skipped so the spinner doesn't
 * appear on mount.
 *
 * @param value - The value to watch. Loading state triggers on every change.
 * @param delay - How long (ms) the loading state stays true. Default 500ms.
 *
 * Example:
 *   const isSearching = useSimulatedLoading(searchQuery);
 *   {isSearching && <Loader2 className="animate-spin w-4 h-4" />}
 */
export function useSimulatedLoading<T>(value: T, delay = 500): boolean {
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return isLoading;
}

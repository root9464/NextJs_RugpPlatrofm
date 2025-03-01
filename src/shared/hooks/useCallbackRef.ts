/* eslint-disable react-hooks/exhaustive-deps */
import { useSafeLayoutEffect } from '@shared/hooks/useSafeLayoutEffect';
import { useCallback, useRef } from 'react';

export function useCallbackRef<T extends (...args: unknown[]) => unknown>(fn: T | undefined, deps: React.DependencyList = []): T {
  const ref = useRef(fn);

  useSafeLayoutEffect(() => {
    ref.current = fn;
  });

  return useCallback(((...args) => ref.current?.(...args)) as T, deps);
}

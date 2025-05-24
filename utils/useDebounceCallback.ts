import { useRef, useCallback } from "react";

function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T {
  // @ts-ignore
  const timer = useRef<NodeJS.Timeout>();
  return useCallback(
    ((...args: any[]) => {
      if (timer.current) clearTimeout(timer.current);
      // @ts-ignore
      timer.current = setTimeout(() => fn(...args), delay);
    }) as T,
    [fn, delay],
  );
}

export default useDebouncedCallback;

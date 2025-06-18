import { useState, useEffect } from "react";

function useDebouncedCallback<T>(value: T, delay: number): T {
  const [debounceValueValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debounceValueValue;
}

export default useDebouncedCallback;

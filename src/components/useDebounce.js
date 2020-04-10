import { useEffect, useState } from "react";

// custom hook
export const useDebounce = (value, delay = 500) => {
  // State and setters for debounced value
  const [debounce, setDebounce] = useState(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebounce(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or componentWillUnmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debounce;
};

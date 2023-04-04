import {useEffect, useRef} from 'react';

export const useTimeout = (cb: () => void, delay?: number | null) => {
  const savedCb = useRef(cb);

  useEffect(() => {
    savedCb.current = cb;
  }, [cb]);

  useEffect(() => {
    if (!delay && delay !== 0) {
      return;
    }

    const id = setTimeout(() => savedCb.current(), delay);

    return () => clearTimeout(id);
  }, [delay]);
};

import {useEffect, useRef} from 'react';

export const useDidUpdate = (fn: () => void, dependencies: any[] = []) => {
  const monuted = useRef<boolean>(false);

  useEffect(() => {
    if (monuted.current) {
      fn();
    } else {
      monuted.current = true;
    }
  }, dependencies);
};

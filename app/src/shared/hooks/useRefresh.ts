import {useState, useCallback} from 'react';

interface RefreshHookResult<T> {
  isRefreshing: boolean;
  onRefresh: () => Promise<T> | Promise<void> | void;
}

export const useRefresh = <T>(
  refresh: () => Promise<T>,
): RefreshHookResult<T> => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    refresh().finally(() => setIsRefreshing(false));
  }, [refresh]);

  // const onRefresh = useCallback(async () => {
  //   setIsRefreshing(true);

  //   try {
  //     const result = await refresh();
  //     return result;
  //   } finally {
  //     setIsRefreshing(false);
  //   }
  // }, [refresh]);

  return {isRefreshing, onRefresh};
};

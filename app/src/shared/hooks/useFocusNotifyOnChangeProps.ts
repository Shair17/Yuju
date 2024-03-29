import {useRef, useCallback} from 'react';
import {NotifyOnChangeProps} from '@tanstack/query-core';
import {useFocusEffect} from '@react-navigation/native';

export const useFocusNotifyOnChangeProps = (
  notifyOnChangeProps?: NotifyOnChangeProps,
) => {
  const focusedRef = useRef<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;

      return () => {
        focusedRef.current = false;
      };
    }, []),
  );

  return () => {
    if (!focusedRef.current) {
      return [];
    }

    if (typeof notifyOnChangeProps === 'function') {
      return notifyOnChangeProps();
    }

    // @ts-ignore
    return notifyOnChangeProps?.current;
  };
};

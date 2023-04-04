import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    function onChange(newState: AppStateStatus) {
      setAppState(newState);
    }

    const subscription = AppState.addEventListener('change', onChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return appState;
};

export type {AppStateStatus};

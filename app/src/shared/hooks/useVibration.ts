import {useEffect} from 'react';
import {Vibration} from 'react-native';

export const useVibration = (
  pattern: number | number[] = 1000,
  repeat?: boolean,
  deps: React.DependencyList = [],
) => {
  useEffect(() => {
    Vibration.vibrate(pattern, repeat);
  }, deps);
};

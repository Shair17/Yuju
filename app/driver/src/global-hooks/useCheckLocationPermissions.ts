import {useEffect} from 'react';
import {AppStateStatus, AppState} from 'react-native';
import {usePermissionsStore} from '@yuju/global-stores/usePermissionsStore';

export const useCheckLocationPermissions = () => {
  const checkLocationPermission = usePermissionsStore(
    s => s.checkLocationPermission,
  );

  useEffect(() => {
    checkLocationPermission();

    const listener = (state: AppStateStatus) => {
      if (state !== 'active') {
        return;
      }

      checkLocationPermission();
    };

    const subscription = AppState.addEventListener('change', listener);

    return () => {
      subscription.remove();
    };
  }, [checkLocationPermission]);
};

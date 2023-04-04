import {useEffect} from 'react';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {isTokenExpired} from '@yuju/services/refresh-token';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';
import {isValidToken} from '@yuju/common/utils/token';

export const useSessionIsExpired = () => {
  const refreshToken = useAuthStore(s => s.refreshToken);

  useEffect(() => {
    if (!refreshToken || !isValidToken(refreshToken)) {
      return;
    }

    if (isTokenExpired(refreshToken)) {
      Notifier.showNotification({
        title: 'Sesión Expirada',
        description:
          'Tu sesión ha expirado, por favor vuelve a iniciar sesión.',
        Component: NotifierComponents.Alert,
        duration: 3000,
        componentProps: {
          alertType: 'error',
          backgroundColor: 'red',
        },
      });
    }
  }, [refreshToken]);
};

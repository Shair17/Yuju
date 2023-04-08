import {useEffect} from 'react';
import {isTokenExpired} from '@yuju/services/refresh-token';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';
import {isValidToken} from '@yuju/common/utils/token';
import {showAlert} from '@yuju/common/utils/notification';

export const useSessionIsExpired = () => {
  const refreshToken = useAuthStore(s => s.refreshToken);

  useEffect(() => {
    if (!refreshToken || !isValidToken(refreshToken)) {
      return;
    }

    if (isTokenExpired(refreshToken)) {
      showAlert({
        title: 'Sesión Expirada',
        description:
          'Tu sesión ha expirado, por favor vuelve a iniciar sesión.',
        duration: 3000,
        alertType: 'error',
      });
    }
  }, [refreshToken]);
};

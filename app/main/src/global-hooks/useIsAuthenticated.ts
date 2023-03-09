import {isValidToken} from '@yuju/common/utils/token';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';
import {isTokenExpired} from '@yuju/services/refresh-token';
import {useEffect, useState} from 'react';

export const useIsAuthenticated = (): boolean => {
  const accessToken = useAuthStore(r => r.accessToken);
  const refreshToken = useAuthStore(r => r.refreshToken);
  const removeTokens = useAuthStore(r => r.removeTokens);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!accessToken && !!refreshToken,
  );

  useEffect(() => {
    if (!accessToken && !refreshToken) {
      setIsAuthenticated(false);
      return;
    }

    if (!isValidToken(accessToken) && !isValidToken(refreshToken)) {
      setIsAuthenticated(false);
      return;
    }

    if (isTokenExpired(refreshToken)) {
      removeTokens();
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(!!accessToken && !!refreshToken);
  }, [accessToken, refreshToken, removeTokens]);

  return isAuthenticated;
};

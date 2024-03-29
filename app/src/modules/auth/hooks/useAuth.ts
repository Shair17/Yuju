import {useAuthStore} from '../stores/useAuthStore';

export const useAuth = () => {
  const accessToken = useAuthStore(store => store.accessToken);
  const refreshToken = useAuthStore(store => store.refreshToken);
  const status = useAuthStore(store => store.status);
  const setStatus = useAuthStore(store => store.setStatus);
  const resetStatus = useAuthStore(store => store.resetStatus);
  const setAccessToken = useAuthStore(store => store.setAccessToken);
  const setRefreshToken = useAuthStore(store => store.setRefreshToken);
  const setTokens = useAuthStore(store => store.setTokens);
  const removeTokens = useAuthStore(store => store.removeTokens);
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const isUnauthenticated = status === 'unauthenticated';

  return {
    tokens: {
      accessToken,
      refreshToken,
    },
    setStatus,
    removeTokens,
    resetStatus,
    setAccessToken,
    setRefreshToken,
    setTokens,
    status,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
  };
};

import {useIsAuthenticated} from './useIsAuthenticated';
import {useRequest} from './useRequest';

export const useIsActive = () => {
  const isAuthenticated = useIsAuthenticated();
  const {data, isLoading} = useRequest<{
    isActive: boolean;
    activationDate: string | null;
  }>(
    isAuthenticated
      ? {
          method: 'GET',
          url: '/drivers/im-active',
        }
      : null,
  );

  if (isLoading || !data) {
    return {
      isActive: false,
      activationDate: null,
    };
  }

  return data;
};

import {useEffect} from 'react';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';
import {useRequest} from './useRequest';
import {useIsAuthenticated} from './useIsAuthenticated';

export const useIsNew = (): boolean => {
  const isAuthenticated = useIsAuthenticated();
  const isNew = useAuthStore(s => s.isNew);
  const setIsNew = useAuthStore(s => s.setIsNew);
  const {data: IamNewUser} = useRequest<boolean>(
    isAuthenticated
      ? {
          method: 'GET',
          url: '/users/me/is-new',
        }
      : null,
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    if (typeof IamNewUser === 'boolean') {
      setIsNew(IamNewUser);
    }
  }, [isAuthenticated, IamNewUser]);

  return isNew;
};

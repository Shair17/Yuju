import {useEffect} from 'react';
import {useRequest} from './useRequest';
import {useIsAuthenticated} from './useIsAuthenticated';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';

export const useIsNew = (): boolean => {
  const isAuthenticated = useIsAuthenticated();
  const isNew = useAuthStore(s => s.isNew);
  const setIsNew = useAuthStore(s => s.setIsNew);
  const {data: IamNewUser} = useRequest<boolean>(
    isAuthenticated
      ? {
          method: 'GET',
          url: '/users/im-new',
        }
      : null,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (typeof IamNewUser === 'boolean') {
      setIsNew(IamNewUser);
    }
  }, [isAuthenticated, IamNewUser, setIsNew]);

  return isNew;
};

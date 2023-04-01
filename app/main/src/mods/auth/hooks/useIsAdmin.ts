import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';

export const useIsAdmin = (): boolean => {
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });

  return myProfile?.user.isAdmin ?? false;
};

import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';

export const useIsAdmin = (): boolean => {
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/drivers/me',
  });

  return myProfile?.driver.isAdmin ?? false;
};

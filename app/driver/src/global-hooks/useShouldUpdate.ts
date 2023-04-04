import {useAppVersion} from './useAppVersion';
import {useRequest} from './useRequest';
import {AppVersionResponse} from '@yuju/types/app';

type ReturnAppShouldUpdate =
  | 'loading'
  | 'error'
  | 'no-needs-update'
  | 'needs-update';

export const useShouldUpdate = (): ReturnAppShouldUpdate => {
  const appVersion = useAppVersion();
  const {data, isLoading, isError} = useRequest<AppVersionResponse>(
    {
      method: 'GET',
      url: '/',
    },
    {
      errorRetryCount: 5,
      errorRetryInterval: 1000,
    },
  );

  if (isLoading) {
    return 'loading';
  }

  if (isError || !data) {
    return 'error';
  }

  if (+data.app_version.split('.')[0] > +appVersion.split('.')[0]) {
    return 'needs-update';
  }

  return 'no-needs-update';
};

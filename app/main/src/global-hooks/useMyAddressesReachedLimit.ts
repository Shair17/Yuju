import {useRequest} from './useRequest';
import {GetMyAddressesResponse} from '@yuju/types/app';
import {MAX_ADDRESSES_PER_USER} from '@yuju/common/constants/app';

export const useMyAddressesReachedLimit = (): boolean => {
  const {data: myAddresses, isLoading} = useRequest<GetMyAddressesResponse>({
    method: 'GET',
    url: '/users/addresses',
  });

  if (isLoading || !myAddresses) {
    return false;
  }

  return myAddresses.addresses.length >= MAX_ADDRESSES_PER_USER;
};

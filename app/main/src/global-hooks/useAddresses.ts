import {GetMyAddressesResponse} from '@yuju/types/app';
import {useRequest} from './useRequest';
import {useMyAddressesReachedLimit} from './useMyAddressesReachedLimit';
import {MAX_ADDRESSES_PER_USER} from '@yuju/common/constants/app';

export const useAddresses = () => {
  const {
    data: myAddresses,
    isLoading: myAddressesIsLoading,
    isValidating: myAddressesIsValidating,
  } = useRequest<GetMyAddressesResponse>({
    method: 'GET',
    url: '/users/addresses',
  });
  const hasReachedLimit = useMyAddressesReachedLimit();
  const addressLength = myAddresses
    ? MAX_ADDRESSES_PER_USER - myAddresses.addresses.length
    : 0;
  const hasOneAddress = myAddresses
    ? MAX_ADDRESSES_PER_USER - myAddresses.addresses.length === 1
    : false;

  return {
    hasReachedLimit,
    hasOneAddress,
    addressLength,
    myAddresses,
    myAddressesIsLoading,
    myAddressesIsValidating,
  };
};

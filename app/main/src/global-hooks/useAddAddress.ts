import {useState} from 'react';
import useAxios from 'axios-hooks';
import z from 'zod';
import {
  CreateAddressBody,
  CreateAddressResponse,
  GetMyAddressesResponse,
  GetMyProfile,
  TagType,
} from '@yuju/types/app';
import {useForm} from 'react-hook-form';
import {LocationInformationType} from '@yuju/navigation/screens/AddAddressesBookmarkScreen';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRequest} from './useRequest';
import {useMyAddressesReachedLimit} from './useMyAddressesReachedLimit';
import {MAX_ADDRESSES_PER_USER} from '@yuju/common/constants/app';

export const LocationInformationSchema = z.object({
  name: z.string(),
  address: z.string(),
  zip: z.string(),
  city: z.string(),
});

export const useAddAddress = () => {
  const [showTagError, setTagError] = useState(false);
  const [tag, setTag] = useState<TagType | undefined>(undefined);
  const [{loading: addAddressIsLoading}, executeCreateAddress] = useAxios<
    CreateAddressResponse,
    CreateAddressBody
  >(
    {
      method: 'POST',
      url: '/users/addresses',
    },
    {manual: true},
  );
  const {control, formState, handleSubmit, setValue, getValues} =
    useForm<LocationInformationType>({
      resolver: zodResolver(LocationInformationSchema),
    });
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });
  const {
    data: myAddresses,
    isLoading: myAddressesIsLoading,
    mutate: mutateMyAddresses,
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
    showTagError,
    setTagError,
    handleSubmit,

    addAddressIsLoading,
    executeCreateAddress,
    tag,
    setTag,

    control,
    formState,
    setValue,
    getValues,

    myProfile,

    myAddressesIsLoading,

    mutateMyAddresses,
    hasReachedLimit,
    addressLength,
    hasOneAddress,
  };
};

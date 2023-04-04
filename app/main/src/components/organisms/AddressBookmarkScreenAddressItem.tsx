import React from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import {Div, Icon, Text} from 'react-native-magnus';
import {GetMyAddressesResponse, MyAddress} from '@yuju/types/app';
import {getAddressBottomSheetIconName} from '@yuju/common/utils/address-icon';
import {showNotification} from '@yuju/common/utils/notification';
import {useRequest} from '@yuju/global-hooks/useRequest';
import useAxios from 'axios-hooks';

interface Props {
  id: MyAddress['id'];
  tag: MyAddress['tag'];
  name: MyAddress['name'];
  address: MyAddress['address'];
  city: MyAddress['city'];
}

export const AddressBookmarkScreenAddressItem: React.FC<Props> = ({
  id,
  address,
  city,
  name,
  tag,
}) => {
  const {
    data: myAddresses,
    isLoading,
    isValidating,
    mutate: mutateMyAddresses,
  } = useRequest<GetMyAddressesResponse>({
    method: 'GET',
    url: '/users/addresses',
  });
  const [{loading: deleteAddressIsLoading}, executeDeleteAddress] = useAxios(
    {
      method: 'DELETE',
      url: `/users/addresses/${id}`,
    },
    {manual: true},
  );

  const iconName = getAddressBottomSheetIconName(tag);

  const deleteAddress = () => {
    if (!myAddresses) {
      return;
    }

    if (myAddresses.addresses.length <= 1) {
      showNotification({
        title: 'Advertencia',
        description: 'No puedes borrar la única dirección que tienes.',
        alertType: 'warn',
      });
      return;
    }

    Alert.alert(
      'Eliminar dirección',
      '¿Estás seguro que quieres borrar esta dirección?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          style: 'default',
          text: 'Sí, estoy seguro',
          onPress: async () => {
            await executeDeleteAddress();
            await mutateMyAddresses();
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <TouchableOpacity
      disabled={isLoading || isValidating || deleteAddressIsLoading}
      activeOpacity={0.8}
      onPress={deleteAddress}>
      <Div
        bg="gray50"
        borderColor="gray200"
        borderWidth={1}
        rounded="lg"
        p="lg"
        row
        justifyContent="space-between">
        <Div justifyContent="center" alignItems="center" flex={0.2}>
          <Icon
            fontFamily="Ionicons"
            name={iconName}
            fontSize="3xl"
            color="primary500"
          />
        </Div>
        <Div flex={1}>
          <Text fontSize="sm" color="primary400">
            {name}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="primary500">
            {address}
          </Text>
          <Text fontSize="lg" fontWeight="500" color="primary500">
            {city}
          </Text>
        </Div>
      </Div>
    </TouchableOpacity>
  );
};

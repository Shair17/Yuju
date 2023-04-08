import React from 'react';
import {
  Button,
  Div,
  Image,
  Skeleton,
  Text,
  useTheme,
} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {FlashList} from '@shopify/flash-list';
import {showAlert} from '@yuju/common/utils/notification';
import {AddressBookmarkScreenAddressItem} from '@yuju/components/organisms/AddressBookmarkScreenAddressItem';
import {useAddresses} from '@yuju/global-hooks/useAddresses';

interface Props
  extends NativeStackScreenProps<
    ProfileStackParams,
    'AddressesBookmarkScreen'
  > {}

export const AddressesBookmarkScreen: React.FC<Props> = ({navigation}) => {
  const {
    theme: {colors},
  } = useTheme();
  const {
    addressLength,
    hasOneAddress,
    hasReachedLimit,
    myAddresses,
    myAddressesIsLoading,
    myAddressesIsValidating,
  } = useAddresses();

  const goToAddCreateNewAddress = () => {
    if (hasReachedLimit) {
      showAlert({
        title: 'Advertencia',
        description:
          'Alcanzaste el límite de direcciones, elimina una de tus direcciones existentes para agregar otra.',
        alertType: 'warn',
      });
      return;
    }

    navigation.navigate('AddAddressesBookmarkScreen');
  };

  return (
    <FlashList
      estimatedItemSize={50}
      data={myAddresses?.addresses ?? []}
      ListEmptyComponent={() => {
        return (
          <Div py="3xl" alignItems="center" justifyContent="center" px="2xl">
            <Image
              source={require('@yuju/assets/images/frowning-face.png')}
              w={150}
              h={150}
            />
            <Text mt="xl" textAlign="center" fontSize="4xl" fontWeight="bold">
              Aún no tienes direcciones guardados
            </Text>

            <Button
              disabled={hasReachedLimit}
              onPress={goToAddCreateNewAddress}
              fontSize="2xl"
              fontWeight="bold"
              bg="primary500"
              block
              mt="xl"
              rounded="lg">
              Crear una
            </Button>
          </Div>
        );
      }}
      ListHeaderComponent={() => {
        return (
          <Div mt="lg" px="2xl">
            <Text fontWeight="bold" fontSize="6xl" color="text" mb="sm">
              Aquí puedes guardar tus direcciones
            </Text>

            {myAddressesIsLoading || !myAddresses ? (
              <Skeleton rounded="lg" w="95%" mt="sm" h={38} bg="gray100" />
            ) : (
              <>
                <Text fontSize="lg" color="text" mb="sm">
                  Puedes tener hasta 10 direcciones, tienes {addressLength}{' '}
                  {hasOneAddress ? 'espacio restante' : 'espacios restantes'}.
                </Text>
                {hasReachedLimit ? (
                  <Text fontWeight="400" color="red" mb="sm">
                    Para eliminar una dirección manten presionada la dirección
                    que quieres eliminar.
                  </Text>
                ) : null}
              </>
            )}

            {!hasReachedLimit ? (
              <Button
                onPress={goToAddCreateNewAddress}
                p="md"
                fontWeight="bold"
                bg="primary100"
                color="primary500"
                block
                rounded="lg">
                Crear nueva dirección
              </Button>
            ) : null}
          </Div>
        );
      }}
      renderItem={({item: {id, address, city, name, tag}}) => {
        return (
          <Div mt="lg" mx="2xl">
            {myAddressesIsLoading || myAddressesIsValidating || false ? (
              <Skeleton key={id} h={88} rounded="lg" bg="gray200" />
            ) : (
              <AddressBookmarkScreenAddressItem
                id={id}
                name={name}
                tag={tag}
                city={city}
                address={address}
              />
            )}
          </Div>
        );
      }}
      keyExtractor={address => address.id}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: colors?.body,
        paddingBottom: 100,
      }}
    />
  );
};

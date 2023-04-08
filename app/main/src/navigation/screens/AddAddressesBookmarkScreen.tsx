import React, {useRef, useCallback, useEffect, Fragment} from 'react';
import {ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {showAlert} from '@yuju/common/utils/notification';
import {defaultUserLocation, useLocation} from '@yuju/global-hooks/useLocation';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {
  Avatar,
  Button,
  Div,
  Icon,
  Input,
  Radio,
  Skeleton,
  Text,
} from 'react-native-magnus';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {MyMarker} from '@yuju/components/atoms/MyMarker';
import {GPSAccessDenied} from '@yuju/components/molecules/GPSAccessDenied';
import {useDimensions} from '@yuju/global-hooks/useDimensions';
import {Controller} from 'react-hook-form';
import {wait} from '@yuju/common/utils/time';
import {defaultTags} from '@yuju/common/constants/tags';
import {useAddAddress} from '@yuju/global-hooks/useAddAddress';
import {globalStyles} from '@yuju/styles/globals';

interface Props
  extends NativeStackScreenProps<
    ProfileStackParams,
    'AddAddressesBookmarkScreen'
  > {}

export const AddAddressesBookmarkScreen: React.FC<Props> = ({navigation}) => {
  const {
    hasLocation,
    gpsAccessDenied,
    initialPosition,
    userLocation,
    getCurrentLocation,
    callGetCurrentLocation,
    followUserLocation,
    stopFollowUserLocation,
  } = useLocation();
  const {
    showTagError,
    setTagError,
    handleSubmit,
    addAddressIsLoading,
    myAddressesIsLoading,
    executeCreateAddress,
    tag,
    setTag,
    control,
    formState,
    getValues,
    setValue,
    myProfile,
    addressLength,
    hasReachedLimit,
    mutateMyAddresses,
    hasOneAddress,
  } = useAddAddress();
  const {
    window: {width: windowWidth, height: windowHeight},
  } = useDimensions();
  const mapRef = useRef<MapView>();
  const following = useRef<boolean>(true);
  const mapReady = useRef<boolean>(false);

  const handleAddNewAddress = handleSubmit(
    async ({name, address, city, zip}) => {
      if (addAddressIsLoading || myAddressesIsLoading) {
        return;
      }

      if (!tag) {
        setTagError(true);
        return;
      }

      await executeCreateAddress({
        data: {
          name,
          address,
          zip,
          city,
          tag,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
      });

      await mutateMyAddresses();

      setTagError(false);

      navigation.goBack();
    },
  );

  const fillLocationInputs = useCallback(() => {
    if (
      userLocation.latitude === defaultUserLocation.latitude &&
      userLocation.longitude === defaultUserLocation.longitude &&
      !mapReady.current
    ) {
      return;
    }

    mapRef.current
      ?.addressForCoordinate(userLocation)
      .then(addressFetchec => {
        const {address, city, zip} = getValues();

        if (!address && !city && !zip) {
          setValue(
            'address',
            `${addressFetchec.thoroughfare} ${addressFetchec.name}`,
          );
          setValue('zip', addressFetchec.postalCode);
          setValue(
            'city',
            `${addressFetchec.locality}, ${addressFetchec.administrativeArea}, ${addressFetchec.country}`,
          );
        }
      })
      .catch(() => {
        fillLocationInputs();

        showAlert({
          title: 'Error al obtener tu dirección',
          description:
            'No hemos podido autocompletar tu dirección, por favor ingresa tu dirección manualmente.',
          alertType: 'error',
        });
      });
  }, [userLocation]);

  const centerPosition = async () => {
    const {latitude, longitude} = await getCurrentLocation();

    following.current = true;

    mapRef.current?.animateCamera({
      zoom: 18,
      center: {latitude, longitude},
    });
  };

  useEffect(() => {
    fillLocationInputs();
  }, [userLocation, fillLocationInputs]);

  useEffect(() => {
    followUserLocation();
    return () => {
      stopFollowUserLocation();
    };
  }, [followUserLocation, stopFollowUserLocation]);

  useEffect(() => {
    if (!following.current) {
      return;
    }

    const {latitude, longitude} = userLocation;
    mapRef.current?.animateCamera({
      center: {latitude, longitude},
    });
  }, [userLocation]);

  useEffect(() => {
    if (hasReachedLimit) {
      showAlert({
        title: 'Advertencia',
        description:
          'Alcanzaste el límite de direcciones, elimina una de tus direcciones existentes para agregar otra.',
        alertType: 'warn',
      });
    }
  }, [hasReachedLimit]);

  return (
    <ScrollScreen>
      <Div bg="body" px="2xl" pt="lg" pb="3xl">
        <Div mb="md">
          <Text fontWeight="bold" fontSize="6xl" color="text" mb="sm">
            Agrega una nueva dirección
          </Text>
          <Text maxW="90%" textAlign="left" fontSize="lg" color="text" mb="sm">
            Puedes tener hasta 10 direcciones, tienes {addressLength}{' '}
            {hasOneAddress ? 'espacio restante' : 'espacios restantes'}.
          </Text>
          {hasReachedLimit ? (
            <Text color="red" textAlign="left" maxW="90%" mb="sm">
              Alcanzaste el límite de direcciones, elimina una dirección para
              poder agregar otra.
            </Text>
          ) : null}
        </Div>

        <Div h={150} w="100%" rounded="lg" overflow="hidden" mb="xl">
          {gpsAccessDenied ? (
            <GPSAccessDenied onButtonPress={callGetCurrentLocation} />
          ) : !hasLocation ? (
            <Div flex={1}>
              <Skeleton.Box w="100%" h="100%" bg="gray100" />
            </Div>
          ) : (
            <Fragment>
              <MapView
                followsUserLocation
                ref={el => (mapRef.current = el!)}
                style={globalStyles.container}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                initialRegion={{
                  latitude: initialPosition.latitude,
                  longitude: initialPosition.longitude,
                  // Para zoom
                  // https://github.com/react-native-maps/react-native-maps/issues/2129
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004 * (windowWidth / windowHeight),
                }}
                onMapReady={() => {
                  mapReady.current = false;
                }}
                showsMyLocationButton={false}
                onTouchStart={() => (following.current = false)}
                onTouchEnd={() => {
                  wait(2000).then(() => {
                    centerPosition();
                  });
                }}>
                <MyMarker
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  title={myProfile?.user.profile.name}
                  description="Estás aquí">
                  <Avatar
                    size={20}
                    rounded="circle"
                    source={{uri: myProfile?.user.profile.avatar}}
                  />
                </MyMarker>
              </MapView>
              <Button
                position="absolute"
                bg="rgba(0,0,0,0.5)"
                rounded="circle"
                top={10}
                right={10}
                onPress={async () => {
                  fillLocationInputs();
                  await centerPosition();
                }}>
                <Icon
                  fontFamily="Ionicons"
                  name="compass"
                  fontSize="2xl"
                  color="white"
                />
              </Button>
            </Fragment>
          )}
        </Div>

        <Div mb="lg">
          <Controller
            control={control}
            rules={{
              maxLength: 250,
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Nombre de tu nueva dirección"
                keyboardType="default"
                fontSize="lg"
                maxLength={250}
                prefix={<Icon fontFamily="Ionicons" name="bookmark" />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                borderColor={formState.errors.name ? 'red' : 'gray400'}
              />
            )}
            name="name"
          />
          {formState.errors.name ? (
            <Text color="red" mt={2} fontWeight="500">
              Nombre de dirección es requerido, ejemplo: Mi Primera Dirección en
              Yuju.
            </Text>
          ) : null}

          <Div my="md" />

          <Controller
            control={control}
            rules={{
              maxLength: 250,
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Tu dirección"
                keyboardType="default"
                fontSize="lg"
                maxLength={250}
                prefix={<Icon fontFamily="Ionicons" name="location" />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                borderColor={formState.errors.address ? 'red' : 'gray400'}
              />
            )}
            name="address"
          />
          {formState.errors.address ? (
            <Text color="red" mt={2} fontWeight="500">
              La dirección es requerido.
            </Text>
          ) : null}

          <Div my="md" />

          <Controller
            control={control}
            rules={{
              maxLength: 15,
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Código postal de tu dirección"
                keyboardType="numeric"
                fontSize="lg"
                maxLength={15}
                prefix={<Icon fontFamily="Ionicons" name="ios-key" />}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                borderColor={formState.errors.zip ? 'red' : 'gray400'}
              />
            )}
            name="zip"
          />
          {formState.errors.zip ? (
            <Text color="red" mt={2} fontWeight="500">
              El código postal es requerido.
            </Text>
          ) : null}

          <Div my="md" />

          <Controller
            control={control}
            rules={{
              maxLength: 250,
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                placeholder="Tu ciudad"
                keyboardType="default"
                fontSize="lg"
                maxLength={250}
                prefix={
                  <Icon fontFamily="MaterialCommunityIcons" name="city" />
                }
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                borderColor={formState.errors.city ? 'red' : 'gray400'}
              />
            )}
            name="city"
          />
          {formState.errors.city ? (
            <Text color="red" mt={2} fontWeight="500">
              La ciudad es requerida.
            </Text>
          ) : null}

          <Div my="md" />

          <Div h={50}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              horizontal
              style={globalStyles.container}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Radio.Group
                row
                onChange={tag => {
                  setTagError(false);
                  setTag(tag);
                }}>
                {defaultTags.map((item, key) => (
                  <Radio value={item.id} key={key.toString()}>
                    {({checked}) => (
                      <Div
                        bg={checked ? 'primary100' : 'white'}
                        borderWidth={1}
                        borderColor={checked ? 'primary' : 'transparent'}
                        row
                        alignItems="center"
                        justifyContent="center"
                        px="lg"
                        py="md"
                        mr={key === defaultTags.length - 1 ? 0 : 'md'}
                        shadow="xs"
                        rounded="circle">
                        <Icon
                          name={item.icon}
                          // @ts-ignore
                          fontFamily={item.iconFontFamily}
                          fontSize="sm"
                          color={checked ? 'primary500' : 'gray800'}
                        />
                        <Text
                          color={checked ? 'primary500' : 'gray800'}
                          fontSize="sm"
                          ml="xs"
                          fontWeight="bold">
                          {item.name}
                        </Text>
                      </Div>
                    )}
                  </Radio>
                ))}
              </Radio.Group>
            </ScrollView>
          </Div>
          {showTagError && (
            <Text color="red" fontWeight="500">
              Elige una etiqueta para tu dirección.
            </Text>
          )}
        </Div>

        <Div>
          <Button
            h={55}
            loading={addAddressIsLoading || myAddressesIsLoading}
            disabled={
              addAddressIsLoading || myAddressesIsLoading || hasReachedLimit
            }
            fontSize="3xl"
            fontWeight="bold"
            bg="primary500"
            block
            mt="md"
            rounded="lg"
            onPress={handleAddNewAddress}>
            Agregar dirección
          </Button>
        </Div>
      </Div>
    </ScrollScreen>
  );
};

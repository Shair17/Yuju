import React, {useRef, useMemo, useEffect, useCallback} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {MyMarker} from '@yuju/components/atoms/MyMarker';
import {Avatar, Button, Div, Icon, Text} from 'react-native-magnus';
import {defaultUserLocation, useLocation} from '@yuju/global-hooks/useLocation';
import {ActivityIndicator} from '@yuju/components/atoms/ActivityIndicator';
import {GPSAccessDenied} from '@yuju/components/molecules/GPSAccessDenied';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RequestStackParams} from '../bottom-tabs/RequestStackScreen';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {PulseActivityIndicator} from '@yuju/components/atoms/PulseActivityIndicator';
import {useDimensions} from '@yuju/global-hooks/useDimensions';
import NumericInput from 'react-native-numeric-input';
import {RequestScreenAskExtraInfo} from '@yuju/components/organisms/RequestScreenAskExtraInfo';
import {RequestScreenAskAddressesSeparator} from '@yuju/components/organisms/RequestScreenAskAddressesSeparator';
import {RequestScreenAskAddressItem} from '@yuju/components/organisms/RequestScreenAskAddressItem';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {globalStyles} from '@yuju/styles/globals';
import {showNotification} from '@yuju/common/utils/notification';
import {useTripStore} from '@yuju/global-stores/useTripStore';
import {RequestScreenAskMessageItem} from '@yuju/components/organisms/RequestScreenAskMessageItem';
import * as Animatable from 'react-native-animatable';
import {openLink} from '@yuju/common/utils/link';
import {SHAIR_INSTAGRAM} from '@yuju/common/constants/app';

interface Props
  extends NativeStackScreenProps<RequestStackParams, 'RequestScreen'> {}

export const RequestScreen: React.FC<Props> = ({navigation}) => {
  //# Trip State
  const [price, setPrice] = useTripStore(s => [s.price, s.setPrice]);
  const [passengersCount, setPassengersCount] = useTripStore(s => [
    s.passengersCount,
    s.setPassengersCount,
  ]);
  const [currentAddress, setCurrentAddress] = useTripStore(s => [
    s.currentAddress,
    s.setCurrentAddress,
  ]);
  const message = useTripStore(s => s.message);

  //# Maps
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
  const mapRef = useRef<MapView>();
  const mapReady = useRef<boolean>(false);
  const following = useRef<boolean>(true);

  //# Bottom Sheet
  //@ Request Ride
  const requestRideBottomSheetRef = useRef<BottomSheet>(null);
  const requestRideSnapPoints = useMemo(() => ['50%', '75%', '100%'], []);
  //@ In Ride Pending
  const inRidePendingBottomSheetRef = useRef<BottomSheet>(null);

  //# User Info
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });

  //# Realtime
  const socket = useSocketStore(s => s.socket);
  const availableDrivers = useSocketStore(s => s.availableDrivers);
  const inRide = useSocketStore(s => s.inRide);
  const inRidePending = useSocketStore(s => s.inRidePending);

  //# Other Hooks Utils
  const {
    window: {width: windowWidth, height: windowHeight},
  } = useDimensions();

  //# Based on Existing state
  const isInRide = !!inRide;
  const isInRidePending = !!inRidePending;
  const disabledToRequestRide = isInRide || isInRidePending;
  const canRequestRide = !disabledToRequestRide;

  const sendRequestRide = () => {
    if (disabledToRequestRide) {
      return;
    }

    socket?.emit('REQUEST_RIDE', {
      passengerId: myProfile?.user.id,
      from: {
        address: currentAddress,
        location: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
      },
      to: {
        address: currentAddress,
        location: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
      },
      passengersQuantity: passengersCount,
      ridePrice: price,
    });
  };

  const cancelPendingRequestRide = () => {
    if (!inRidePending) return;

    socket?.emit('CANCEL_RIDE_PENDING', {
      id: inRidePending.id,
      passenger: {
        id: inRidePending.user.id,
      },
    });
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const centerPosition = async () => {
    const {latitude, longitude} = await getCurrentLocation();

    following.current = true;

    mapRef.current?.animateCamera({
      zoom: 18,
      center: {latitude, longitude},
    });
  };

  const fillLocationInputs = useCallback(() => {
    if (
      userLocation.latitude === defaultUserLocation.latitude &&
      userLocation.longitude === defaultUserLocation.longitude &&
      !mapReady.current
    )
      return;

    mapRef.current
      ?.addressForCoordinate(userLocation)
      .then(address => {
        if (!currentAddress) {
          showNotification({
            title: 'Yuju',
            description: 'Tu dirección se autocompletó',
          });
        }

        setCurrentAddress(
          `${address.thoroughfare} ${address.name}, ${address.locality}`,
        );
      })
      .catch(() => {
        // TODO: verificar si debo dejar esto acá o no
        fillLocationInputs();
      });
  }, [userLocation]);

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
    socket?.emit('PASSENGER_LOCATION', userLocation);

    return () => {
      socket?.off('PASSENGER_LOCATION');
    };
  }, [socket, userLocation]);

  if (gpsAccessDenied) {
    return <GPSAccessDenied onButtonPress={callGetCurrentLocation} />;
  }

  if (!hasLocation) {
    return (
      <Div flex={1} bg="body" justifyContent="center" alignItems="center">
        <ActivityIndicator />
      </Div>
    );
  }

  return (
    <Div flex={1} bg="body">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/** Map Container */}
      <Div flex={1} style={StyleSheet.absoluteFillObject}>
        <MapView
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
          loadingEnabled
          mapPadding={{
            bottom: windowHeight / 2,
            left: 0,
            right: 0,
            top: 0,
          }}
          showsMyLocationButton={false}
          onMapReady={() => {
            mapReady.current = false;
            centerPosition();
          }}
          onTouchStart={() => (following.current = false)}>
          <MyMarker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title={myProfile?.user.profile.name}
            description="Estás aquí">
            <Avatar
              size={15}
              rounded="circle"
              source={{uri: myProfile?.user.profile.avatar}}
            />
          </MyMarker>

          {availableDrivers.map(
            ({id, name, avatar, location: {latitude, longitude}}) => (
              <MyMarker
                key={id}
                coordinate={{
                  latitude,
                  longitude,
                }}
                title={name}
                description="Mototaxista">
                <Avatar size={10} rounded="circle" source={{uri: avatar}} />
              </MyMarker>
            ),
          )}
        </MapView>
        <Button
          position="absolute"
          bg="rgba(0,0,0,0.5)"
          rounded="circle"
          top={10}
          right={10}
          onPress={centerPosition}>
          <Icon
            fontFamily="Ionicons"
            name="compass"
            fontSize="2xl"
            color="white"
          />
        </Button>
      </Div>

      {canRequestRide ? (
        <BottomSheet
          index={0}
          ref={requestRideBottomSheetRef}
          snapPoints={requestRideSnapPoints}
          onChange={handleSheetChanges}>
          <BottomSheetScrollView>
            <Div px="2xl" pt="lg" flex={1}>
              <Div>
                {/** Separator */}
                <RequestScreenAskAddressesSeparator />

                <RequestScreenAskAddressItem
                  leftIcon={
                    <PulseActivityIndicator
                      style={{
                        alignItems: 'center',
                        alignContent: 'center',
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}
                      size={25}
                    />
                  }
                  locationInputLabel="Desde"
                  locationValue={
                    currentAddress ? currentAddress : 'Mi ubicación actual'
                  }
                  onLocationInputPress={() =>
                    // navigation.navigate('ChooseStartingLocationScreen')
                    fillLocationInputs()
                  }
                />

                <RequestScreenAskAddressItem
                  mt="md"
                  leftIcon={
                    <Icon
                      alignSelf="center"
                      fontFamily="Ionicons"
                      name="location"
                      color="primary500"
                      fontSize={25}
                    />
                  }
                  locationInputLabel="Hasta"
                  locationValue="Elige tu destino"
                  onLocationInputPress={() =>
                    navigation.navigate('ChooseDestinationLocationScreen')
                  }
                />
              </Div>

              <Div mt="md">
                {/** Cantidad de pasajeros */}
                <Div row>
                  <RequestScreenAskExtraInfo
                    title="¿Cuántos son?"
                    subtitle="* Cantidad de personas que subirán a la mototaxi."
                  />
                  <NumericInput
                    validateOnBlur
                    value={passengersCount}
                    onChange={setPassengersCount}
                    editable={false}
                    minValue={1}
                    step={1}
                    maxValue={3}
                    rounded
                    valueType="integer"
                    totalWidth={110}
                  />
                </Div>

                {/** Precio de carrera */}
                <Div row mt="md">
                  <RequestScreenAskExtraInfo
                    title="¿Cuánto pagas?"
                    subtitle="* Cantidad que estás dispuesto a pagar (S/)."
                  />
                  <NumericInput
                    validateOnBlur
                    value={price}
                    onChange={setPrice}
                    editable={false}
                    minValue={2}
                    step={0.5}
                    rounded
                    valueType="real"
                    totalWidth={110}
                  />
                </Div>

                {/** Mensaje para el chófer */}
                <Div mt="md">
                  <RequestScreenAskMessageItem
                    askMessageInputLabel="Mensaje"
                    askMessageValue={message}
                    onAskMessagePress={() =>
                      navigation.navigate('WriteTripMessageScreen')
                    }
                  />
                </Div>
              </Div>

              <Button
                // disabled={disabledToRequestRide}
                loading={isInRidePending}
                justifyContent="center"
                alignItems="center"
                alignSelf="center"
                fontSize="2xl"
                fontWeight="bold"
                bg="primary500"
                block
                h={50}
                mt="lg"
                rounded="lg"
                onPress={sendRequestRide}>
                Solicitar Mototaxi
              </Button>
            </Div>
          </BottomSheetScrollView>
        </BottomSheet>
      ) : null}

      {/** Hacer de esto un componente por aparte para aumentarle la lógica */}
      {isInRidePending ? (
        <BottomSheet ref={inRidePendingBottomSheetRef} snapPoints={['100%']}>
          <Div flex={1} alignItems="center" justifyContent="center" px="2xl">
            <PulseActivityIndicator />

            <Text mt="lg" fontSize="xl" textAlign="center" fontWeight="bold">
              Estamos buscando al mototaxista más cercano
            </Text>

            <Animatable.View animation="fadeInUp" delay={2000}>
              <Text mt="lg">Esto puede tardar unos segundos.</Text>
            </Animatable.View>

            <Animatable.View
              animation="fadeInUp"
              delay={5000}
              easing="ease-in-out">
              <Button
                mt="lg"
                alignSelf="center"
                px="md"
                py="sm"
                m={0}
                fontSize="md"
                bg="red50"
                color="red500"
                justifyContent="center"
                alignItems="center"
                underlayColor="red100"
                rounded="lg"
                onPress={cancelPendingRequestRide}>
                Cancelar
              </Button>
            </Animatable.View>

            <Animatable.View
              style={{position: 'absolute', bottom: 10}}
              animation="fadeIn"
              delay={1000}
              easing="ease-in-out">
              <Div alignSelf="center" alignItems="center">
                <Text
                  fontSize={6}
                  color="gray700"
                  onPress={() => openLink(SHAIR_INSTAGRAM)}>
                  Desarrollado por{' '}
                  <Text fontSize={6} color="gray700" fontWeight="500">
                    @shair.dev
                  </Text>
                  .
                </Text>
              </Div>
            </Animatable.View>
          </Div>
        </BottomSheet>
      ) : null}
    </Div>
  );
};

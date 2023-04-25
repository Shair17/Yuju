import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  Fragment,
} from 'react';
import {StatusBar, Alert, StyleSheet} from 'react-native';
import {Avatar, Button, Div, Icon, Text} from 'react-native-magnus';
import {HomeStackParams} from '../stacks/HomeStackScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {MyMarker} from '@yuju/components/atoms/MyMarker';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {PulseActivityIndicator} from '@yuju/components/atoms/PulseActivityIndicator';
import {useDimensions} from '@yuju/global-hooks/useDimensions';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {globalStyles} from '@yuju/styles/globals';
import {showNotification} from '@yuju/common/utils/notification';
import * as Animatable from 'react-native-animatable';
import {defaultUserLocation, useLocation} from '@yuju/global-hooks/useLocation';
import {GetMyProfile} from '@yuju/types/app';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GPSAccessDenied} from '@yuju/components/molecules/GPSAccessDenied';
import {ActivityIndicator} from '@yuju/components/atoms/ActivityIndicator';
import {convertDistance, getDistance} from '@yuju/common/utils/location';
import {useGreeting} from '@yuju/global-hooks/useGreeting';
import {useBackHandler} from '@yuju/global-hooks/useBackHandler';

import {data as rides} from './HomeScreen';

interface Props extends NativeStackScreenProps<HomeStackParams, 'TripScreen'> {}

// TODO: con `driverHasArrivedAtPassenger` cuando esté en true implementar un useInterval que solo se ejecutara si driverHasArrivedAtPassenger es true, entonces en base a la distancia de la ubicacion actual y la ubicacion destino se recalculan para saber si la distancia es menos de 10 metros y así saber si la carrera está por finalizarse

export const TripScreen: React.FC<Props> = ({navigation, route}) => {
  const id = route.params.id;

  const [driverHasArrivedAtPassenger, setDriverHasArrivedAtPassenger] =
    useState<boolean>(false);

  //# Bottom Sheet
  const rideBottomSheetRef = useRef<BottomSheet>(null);
  const rideSnapPoints = useMemo(() => ['50%'], []);

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

  //# User Info
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/drivers/me',
  });

  //# Realtime
  const socket = useSocketStore(s => s.socket);
  // const rides = useSocketStore(s => s.pendingRides);
  const ride = rides.find(ride => ride.id !== id);
  const rideExists = !!ride;
  const distance = getDistance(
    ride?.from.location ?? defaultUserLocation,
    ride?.to.location ?? defaultUserLocation,
  );
  const convertedDistance = convertDistance(distance);

  //# Other Hooks Utils
  const {
    window: {width: windowWidth, height: windowHeight},
  } = useDimensions();
  const greeting = useGreeting();

  // logica para no permitir que vaya para atrás
  useBackHandler(() => rideExists);

  const centerPosition = async () => {
    const {latitude, longitude} = await getCurrentLocation();

    following.current = true;

    mapRef.current?.animateCamera({
      zoom: 18,
      center: {latitude, longitude},
    });
  };

  const cancelTrip = () => {
    Alert.alert(
      'Cancelar carrera',
      '¿Estás seguro que quieres cancelar la carrera?',
      [
        {
          text: 'Sí',
          onPress() {
            // TODO: cancelar la carrera para el pasajero también

            navigation.popToTop();
          },
        },
        {text: 'No', style: 'cancel'},
      ],
      {
        cancelable: true,
      },
    );
  };

  // useEffect(() => {
  //   if (driverHasArrivedAtPassenger) {
  //     rideBottomSheetRef.current?.expand();
  //   } else {
  //     rideBottomSheetRef.current?.collapse();
  //   }
  // }, [driverHasArrivedAtPassenger]);

  useEffect(() => {
    if (rideExists) return;

    navigation.goBack();
  }, [rideExists]);

  if (gpsAccessDenied) {
    return <GPSAccessDenied onButtonPress={callGetCurrentLocation} />;
  }

  // TODO: eliminar rideExists
  if (!hasLocation || !rideExists) {
    return (
      <Div flex={1} bg="body" justifyContent="center" alignItems="center">
        <ActivityIndicator />
      </Div>
    );
  }

  return (
    <Div flex={1} bg="body">
      <Div flex={1} style={StyleSheet.absoluteFillObject}>
        <MapView
          ref={el => (mapRef.current = el!)}
          style={globalStyles.container}
          provider={PROVIDER_GOOGLE}
          loadingEnabled
          initialRegion={{
            latitude: initialPosition.latitude,
            longitude: initialPosition.longitude,
            // Para zoom
            // https://github.com/react-native-maps/react-native-maps/issues/2129
            latitudeDelta: 0.004,
            longitudeDelta: 0.004 * (windowWidth / windowHeight),
          }}
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
          {/* <MyMarker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title={myProfile?.driver.profile.name}
            description="Estás aquí">
            <Avatar
              size={15}
              rounded="circle"
              source={{uri: myProfile?.driver.profile.avatar}}
            />
          </MyMarker> */}

          {/** Map Directions and Driver and User Markers*/}
          {driverHasArrivedAtPassenger ? (
            <Fragment>
              <MapViewDirections
                origin={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                destination={ride.to.location}
                apikey="AIzaSyDBND9RZ9d3FNN9B2VNkW5v9NnhRghlxUg"
                strokeWidth={3}
                strokeColor="#3366FF"
              />

              <MyMarker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Tu pasajer@ y tú"
                description="Están aquí">
                <Avatar
                  size={20}
                  rounded="circle"
                  source={{uri: myProfile?.driver.profile.avatar}}
                />
              </MyMarker>

              <MyMarker
                coordinate={ride.to.location}
                title={ride.user.name}
                description="Quiero ir aquí">
                {/* <Avatar
                  size={20}
                  rounded="circle"
                  source={{uri: myProfile?.driver.profile.avatar}}
                /> */}
              </MyMarker>
            </Fragment>
          ) : (
            <Fragment>
              <MapViewDirections
                origin={userLocation}
                destination={ride.from.location}
                apikey="AIzaSyDBND9RZ9d3FNN9B2VNkW5v9NnhRghlxUg"
                strokeWidth={3}
                strokeColor="#FF6816"
              />

              <MyMarker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title={myProfile?.driver.profile.name}
                description="Estás aquí">
                <Avatar
                  size={20}
                  rounded="circle"
                  source={{uri: myProfile?.driver.profile.avatar}}
                />
              </MyMarker>
              <MyMarker
                coordinate={ride.from.location}
                title={ride.user.avatar}
                description="Tu pasajer@ está aquí">
                {/* <Avatar
                  size={15}
                  rounded="circle"
                  source={{uri: myProfile?.driver.profile.avatar}}
                /> */}
              </MyMarker>
            </Fragment>
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

      <BottomSheet
        index={0}
        enableHandlePanningGesture={false}
        enableOverDrag={false}
        enableContentPanningGesture={false}
        ref={rideBottomSheetRef}
        snapPoints={rideSnapPoints}>
        <BottomSheetScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <Div flex={1} px="2xl" pt="lg">
            {driverHasArrivedAtPassenger ? (
              <Div flex={1}>
                <Button
                  block
                  rounded="lg"
                  bg="green500"
                  fontWeight="500"
                  mr="xs"
                  onPress={() =>
                    setDriverHasArrivedAtPassenger(!driverHasArrivedAtPassenger)
                  }>
                  tovia no se sube
                </Button>
              </Div>
            ) : (
              <Div flex={1}>
                <Animatable.View animation="fadeIn" delay={500} useNativeDriver>
                  <Div>
                    <Text numberOfLines={1} fontSize="2xl" fontWeight="500">
                      {greeting}{' '}
                      <Text
                        numberOfLines={1}
                        fontSize="2xl"
                        fontWeight="700"
                        color="primary500">
                        {myProfile?.driver.profile.name}
                      </Text>
                    </Text>
                  </Div>
                </Animatable.View>

                <Animatable.View
                  animation="fadeIn"
                  delay={1000}
                  useNativeDriver>
                  <Div mt="xl">
                    <Text color="gray500" fontSize="xl">
                      Tu pasajer@ está en{' '}
                      <Text color="danger500" fontWeight="bold" fontSize="xl">
                        {ride.from.address}
                      </Text>
                      .
                    </Text>

                    <Text mt="md" color="gray500" fontSize="lg">
                      Sigue la ruta{' '}
                      <Text color="danger500" fontWeight="bold" fontSize="lg">
                        NARANJA
                      </Text>{' '}
                      y llegarás a tu pasajer@.
                    </Text>
                  </Div>
                </Animatable.View>

                <Animatable.View
                  animation="fadeIn"
                  delay={1500}
                  useNativeDriver>
                  <Div mt="xl" alignItems="center" justifyContent="center">
                    <PulseActivityIndicator />
                  </Div>
                </Animatable.View>

                <Animatable.View
                  animation="fadeIn"
                  delay={2000}
                  useNativeDriver>
                  <Div mt="xl">
                    <Text color="gray500" fontSize="xs">
                      Cuando tu pasajer@ suba a tu moto presiona el botón verde.
                    </Text>
                    <Div row mt="md">
                      <Button
                        flex={1}
                        rounded="lg"
                        bg="green500"
                        fontWeight="500"
                        mr="xs"
                        onPress={() =>
                          setDriverHasArrivedAtPassenger(
                            !driverHasArrivedAtPassenger,
                          )
                        }>
                        ¿Ya se subió?
                      </Button>
                      <Button
                        flex={1}
                        rounded="lg"
                        fontWeight="500"
                        bg="red50"
                        underlayColor="red100"
                        color="red500"
                        ml="xs"
                        onPress={cancelTrip}>
                        Cancelar
                      </Button>
                    </Div>
                  </Div>
                </Animatable.View>
              </Div>
            )}
          </Div>
        </BottomSheetScrollView>
      </BottomSheet>
    </Div>
  );
};

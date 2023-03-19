import React, {useRef, useMemo, useEffect, useCallback, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Avatar, Button, Div, Icon} from 'react-native-magnus';
import {defaultUserLocation, useLocation} from '@yuju/global-hooks/useLocation';
import {ActivityIndicator} from '@yuju/components/atoms/ActivityIndicator';
import {GPSAccessDenied} from '@yuju/components/molecules/GPSAccessDenied';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RequestStackParams} from '../bottom-tabs/RequestStackScreen';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {PulseActivityIndicator} from '@yuju/components/atoms/PulseActivityIndicator';
import {useDimensions} from '@yuju/global-hooks/useDimensions';
import NumericInput from 'react-native-numeric-input';
import {RequestScreenAskExtraInfo} from '@yuju/components/organisms/RequestScreenAskExtraInfo';
import {RequestScreenAskAddressesSeparator} from '@yuju/components/organisms/RequestScreenAskAddressesSeparator';
import {RequestScreenAskAddressItem} from '@yuju/components/organisms/RequestScreenAskAddressItem';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';

interface Props
  extends NativeStackScreenProps<RequestStackParams, 'RequestScreen'> {}

export const RequestScreen: React.FC<Props> = ({navigation, route}) => {
  const [price, setPrice] = useState<number>(3);
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '75%', '100%'], []);
  const {
    window: {width: windowWidth, height: windowHeight},
  } = useDimensions();
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });
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
  const socket = useSocketStore(s => s.socket);

  // const handleSheetChanges = useCallback((index: number) => {
  // console.log('handleSheetChanges', index);
  // }, []);

  const fillLocationInputs = useCallback(() => {
    if (
      userLocation.latitude === defaultUserLocation.latitude &&
      userLocation.longitude === defaultUserLocation.longitude &&
      !mapReady.current
    ) {
      console.log('aun no está listo');
      return;
    }

    mapRef.current
      ?.addressForCoordinate(userLocation)
      .then(address => {
        setCurrentAddress(
          `${address.thoroughfare} ${address.name}, ${address.locality}`,
        );
      })
      .catch(() => {
        console.log('HomeScreenCurrentLocation error');
        // TODO: verificar si debo dejar esto acá o no
        fillLocationInputs();
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
  }, [userLocation]);

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
          style={{flex: 1}}
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
          <Marker
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
          </Marker>
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

      {/** Bottom Sheet */}
      <BottomSheet
        index={0}
        // enablePanDownToClose
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        // onChange={handleSheetChanges}
      >
        <BottomSheetView style={{flex: 1}}>
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
                  !!currentAddress ? currentAddress : 'Mi ubicación actual'
                }
                onLocationInputPress={() =>
                  navigation.navigate('ChooseStartingLocationScreen')
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
                  onLimitReached={(isMax, msg) => console.log(isMax, msg)}
                  value={passengersCount}
                  onChange={setPassengersCount}
                  editable={false}
                  minValue={1}
                  step={1}
                  maxValue={3}
                  rounded
                  valueType="integer"
                  totalWidth={120}
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
                  onLimitReached={(isMax, msg) => console.log(isMax, msg)}
                  value={price}
                  onChange={setPrice}
                  editable={false}
                  minValue={2}
                  step={0.5}
                  rounded
                  valueType="real"
                  totalWidth={120}
                />
              </Div>
            </Div>

            <Button
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
              onPress={() => {
                // navigation.navigate('MeetYourDriverScreen', {
                //   id: '123',
                // })
              }}>
              Solicitar Mototaxi
            </Button>
          </Div>
        </BottomSheetView>
      </BottomSheet>
    </Div>
  );
};

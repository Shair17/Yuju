import React, {useEffect, useRef, useState, useCallback, Fragment} from 'react';
import {Vibration} from 'react-native';
import {Button, Div, Icon, Text, Skeleton, Avatar} from 'react-native-magnus';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import TextTicker from 'react-native-text-ticker';
import {useLocation, defaultUserLocation} from '@yuju/global-hooks/useLocation';
import {GPSAccessDenied} from '../molecules/GPSAccessDenied';
import {useClipboard} from '@react-native-clipboard/clipboard';
import {Notifier} from 'react-native-notifier';
import {useRequest} from '../../global-hooks/useRequest';
import {GetMyProfile} from '../../types/app';
import {wait} from '@yuju/common/utils/time';
import {useDimensions} from '@yuju/global-hooks/useDimensions';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {globalStyles} from '@yuju/styles/globals';

export const HomeScreenCurrentLocation: React.FC = () => {
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const mapRef = useRef<MapView>();
  const following = useRef<boolean>(true);
  const mapReady = useRef<boolean>(false);
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });
  const {
    window: {width: windowWidth, height: windowHeight},
  } = useDimensions();
  const [, setClipboard] = useClipboard();
  const socket = useSocketStore(s => s.socket);
  const {
    userLocation,
    initialPosition,
    gpsAccessDenied,
    hasLocation,
    followUserLocation,
    stopFollowUserLocation,
    getCurrentLocation,
    callGetCurrentLocation,
  } = useLocation();

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
      .then(address => {
        setCurrentAddress(
          `${address.thoroughfare} ${address.name}, ${address.locality}, ${address.administrativeArea}`,
        );
        // setCurrentAddress(
        //   `${address.thoroughfare} ${address.name}, ${address.locality}, ${
        //     address.administrativeArea
        //   }, ${address.country.replace('Peru', 'Perú')} - ${
        //     address.postalCode
        //   }`,
        // );
      })
      .catch(error => {
        console.log(error);
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

  const handleCopyMyCurrentAddressToClipboard = () => {
    if (!currentAddress) {
      return;
    }

    setClipboard(currentAddress);

    Vibration.vibrate(15);

    Notifier.showNotification({
      title: 'Portapapeles',
      description: 'Tu dirección ha sido copiado al portapapeles.',
      hideOnPress: true,
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
    socket?.emit('PASSENGER_LOCATION', userLocation);

    return () => {
      socket?.off('PASSENGER_LOCATION');
    };
  }, [socket, userLocation]);

  return (
    <Div mt="lg" alignItems="center">
      <Div row>
        <Icon
          fontFamily="Ionicons"
          name="location"
          fontSize="md"
          color="primary500"
          mr="xs"
        />

        <Div flex={1}>
          <TextTicker
            duration={5000}
            loop
            bounce
            onPress={handleCopyMyCurrentAddressToClipboard}>
            <Text color="primary500" fontSize="md" fontWeight="500">
              {currentAddress ? currentAddress : 'Cargando...'}
            </Text>
          </TextTicker>
        </Div>
      </Div>

      <Div h={150} w="100%" mt="lg" rounded="lg" overflow="hidden">
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
          </Fragment>
        )}
      </Div>
    </Div>
  );
};

import React, {useEffect, useRef, Fragment} from 'react';
import {Vibration} from 'react-native';
import {Button, Div, Icon, Text, Skeleton, Avatar} from 'react-native-magnus';
import {HomeStackParams} from '../stacks/HomeStackScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {showAlert, showNotification} from '@yuju/common/utils/notification';
import {LoadingTemplate} from '@yuju/components/templates/LoadingTemplate';
import {MyMarker} from '@yuju/components/atoms/MyMarker';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {useLocation, defaultUserLocation} from '@yuju/global-hooks/useLocation';
import {GPSAccessDenied} from '@yuju/components/molecules/GPSAccessDenied';
import {useDimensions} from '@yuju/global-hooks/useDimensions';
import {globalStyles} from '@yuju/styles/globals';
import {wait} from '@yuju/common/utils/time';
import TextTicker from 'react-native-text-ticker';
import {convertDistance, getDistance} from '@yuju/common/utils/location';
import {data as pendingRides} from './HomeScreen';

interface Props
  extends NativeStackScreenProps<HomeStackParams, 'TripDetailsScreen'> {}

export const TripDetailsScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: {id, isNearPassenger = false},
  },
}) => {
  const {gpsAccessDenied, hasLocation, callGetCurrentLocation} = useLocation();
  const mapRef = useRef<MapView>();
  const following = useRef<boolean>(true);
  const mapReady = useRef<boolean>(false);
  const {
    window: {width: windowWidth, height: windowHeight},
  } = useDimensions();

  // const id = route.params.id;
  // const pendingRides = useSocketStore(s => s.pendingRides);
  const pendingRide = pendingRides.find(pendingRide => pendingRide.id !== id);
  const pendingRideExists = !!pendingRide;
  const distance = getDistance(
    pendingRide?.from.location ?? defaultUserLocation,
    pendingRide?.to.location ?? defaultUserLocation,
  );
  const convertedDistance = convertDistance(distance);

  const centerPosition = () => {
    following.current = true;

    if (!pendingRide) return;

    mapRef.current?.fitToCoordinates(
      [pendingRide.from.location, pendingRide.to.location],
      {
        edgePadding: {top: 20, right: 20, bottom: 20, left: 20},
        animated: true,
      },
    );
  };

  useEffect(() => {
    if (!pendingRideExists) {
      showAlert({
        title: 'Yuju',
        description: 'La carrera ya fue tomada.',
        alertType: 'warn',
        duration: 1000,
      });
      Vibration.vibrate(20);
      navigation.goBack();
    }
  }, [navigation, pendingRideExists]);

  useEffect(() => {
    if (!pendingRideExists) return;

    centerPosition();
  }, [pendingRideExists]);

  useEffect(() => {
    if (!isNearPassenger) return;

    showAlert({
      title: 'Yuju',
      description: '¡Hay una carrera disponible cerca de donde estás!',
      alertType: 'info',
      duration: 5000,
    });
  }, [isNearPassenger]);

  if (!pendingRideExists) {
    return <LoadingTemplate />;
  }

  return (
    <Div flex={1} bg="body" p="2xl" justifyContent="space-between">
      <Div>
        <Div>
          <Text fontSize={10} color="gray500">
            Pasajero
          </Text>
          <Div row alignItems="center">
            <Avatar size={25} source={{uri: pendingRide.user.avatar}} />
            <Text ml="sm" fontSize="4xl" color="#000" fontWeight="700">
              {pendingRide.user.name}
            </Text>
          </Div>
        </Div>

        <Div mt="sm">
          <Text fontSize={10} color="gray500">
            Estoy aquí
          </Text>

          <TextTicker duration={5000} loop bounce>
            <Text fontSize="2xl" color="#000" fontWeight="600">
              {pendingRide.from.address}
            </Text>
          </TextTicker>
        </Div>

        <Div mt="sm">
          <Text fontSize={10} color="gray500">
            Quiero ir aquí
          </Text>

          <TextTicker duration={5000} loop bounce>
            <Text fontSize="2xl" color="#000" fontWeight="600">
              {pendingRide.from.address}
            </Text>
          </TextTicker>
        </Div>

        <Div row mt="sm" justifyContent="space-between">
          <Text color="green500" fontWeight="bold" fontSize="xl">
            S/{pendingRide.ridePrice}
          </Text>
          <Div ml="lg" row>
            <Icon
              fontFamily="Ionicons"
              name={pendingRide.passengersQuantity > 1 ? 'people' : 'person'}
              color="gray500"
              fontSize="xl"
            />
            <Text ml="xs" fontSize="xl" color="gray500">
              {pendingRide.passengersQuantity}
            </Text>
          </Div>
          <Text ml="lg" fontSize="xl" color="gray500">
            ~{convertedDistance}.
          </Text>
        </Div>

        <Div h={400} w="100%" mt="lg" rounded="lg" overflow="hidden">
          {gpsAccessDenied ? (
            <GPSAccessDenied onButtonPress={callGetCurrentLocation} />
          ) : !hasLocation ? (
            <Div flex={1}>
              <Skeleton.Box w="100%" h="100%" bg="gray100" rounded="lg" />
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
                  latitude: pendingRide.from.location.latitude,
                  longitude: pendingRide.from.location.longitude,

                  // Para zoom
                  // https://github.com/react-native-maps/react-native-maps/issues/2129
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004 * (windowWidth / windowHeight),
                }}
                onMapReady={() => {
                  mapReady.current = false;
                  centerPosition();
                }}
                showsMyLocationButton={false}
                onTouchStart={() => (following.current = false)}
                onTouchEnd={() => {
                  wait(2000).then(() => {
                    centerPosition();
                  });
                }}>
                <MyMarker
                  coordinate={pendingRide.from.location}
                  title={pendingRide.user.name}
                  description="Aquí estoy">
                  <Avatar
                    size={25}
                    rounded="circle"
                    source={{uri: pendingRide.user.avatar}}
                  />
                </MyMarker>
                <MyMarker
                  coordinate={pendingRide.to.location}
                  title={pendingRide.user.name}
                  description={`Quiero ir aquí`}>
                  {/* <Icon
                    name="location"
                    fontSize={25}
                    rounded="circle"
                    fontFamily="Ionicons"
                  /> */}
                </MyMarker>

                <MapViewDirections
                  origin={pendingRide.from.location}
                  destination={pendingRide.to.location}
                  apikey="AIzaSyDBND9RZ9d3FNN9B2VNkW5v9NnhRghlxUg"
                  strokeWidth={3}
                  strokeColor="#3366FF"
                />
              </MapView>
            </Fragment>
          )}
        </Div>
      </Div>
      <Div flex={1} alignItems="center" justifyContent="center">
        <Button
          onPress={() =>
            navigation.replace('TripScreen', {
              id: pendingRide.id,
            })
          }
          block
          rounded="lg"
          disabled={!pendingRideExists}
          fontSize="xl"
          fontWeight="bold">
          Aceptar Carrera
        </Button>
      </Div>
    </Div>
  );
};

import React, {useRef, useMemo, useEffect, useCallback, useState} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {
  Marker,
  Polygon,
  MapViewProps,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {Avatar, Button, Div, Icon, Text, Input} from 'react-native-magnus';
import {defaultUserLocation, useLocation} from '@yuju/global-hooks/useLocation';
import {ActivityIndicator} from '@yuju/components/atoms/ActivityIndicator';
import {GPSAccessDenied} from '@yuju/components/molecules/GPSAccessDenied';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RequestStackParams} from '../bottom-tabs/RequestStackScreen';
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetFooter,
  BottomSheetView,
  BottomSheetFooterProps,
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetVirtualizedList,
} from '@gorhom/bottom-sheet';
import {PulseActivityIndicator} from '@yuju/components/atoms/PulseActivityIndicator';
import {useDimensions} from '@yuju/global-hooks/useDimensions';

interface Props
  extends NativeStackScreenProps<RequestStackParams, 'RequestScreen'> {}

export const RequestScreen: React.FC<Props> = ({navigation, route}) => {
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
            <Text fontSize="4xl" fontWeight="700">
              Solicitar Mototaxi
            </Text>

            <Div mt="md">
              {/** Separator */}
              <Div
                left={11.5}
                position="absolute"
                h="100%"
                alignItems="center"
                justifyContent="center">
                <Div
                  w={1}
                  borderWidth={1}
                  borderColor="gray200"
                  h="20%"
                  rounded="circle"
                />
              </Div>

              <Div row justifyContent="space-between">
                <Div alignItems="center" justifyContent="center" mr="md">
                  <PulseActivityIndicator
                    style={{
                      alignItems: 'center',
                      alignContent: 'center',
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                    size={25}
                  />
                </Div>

                <Div flex={1}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      navigation.navigate('ChooseStartingLocationScreen')
                    }
                    style={{borderRadius: 8}}>
                    <Div
                      overflow="hidden"
                      bg="gray100"
                      rounded="lg"
                      px="md"
                      py="sm">
                      <Text fontSize={10} fontWeight="500" color="gray400">
                        Desde
                      </Text>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="#000"
                        numberOfLines={1}>
                        {!!currentAddress
                          ? currentAddress
                          : 'Mi ubicación actual'}
                      </Text>
                    </Div>
                  </TouchableOpacity>
                </Div>
              </Div>

              <Div row mt="md" justifyContent="space-between">
                <Div alignItems="center" justifyContent="center" mr="md">
                  <Icon
                    alignSelf="center"
                    fontFamily="Ionicons"
                    name="location"
                    color="primary500"
                    fontSize={25}
                  />
                </Div>

                <Div flex={1}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      navigation.navigate('ChooseDestinationLocationScreen')
                    }
                    style={{borderRadius: 8}}>
                    <Div
                      overflow="hidden"
                      bg="gray100"
                      rounded="lg"
                      px="md"
                      py="sm">
                      <Text fontSize={10} fontWeight="500" color="gray400">
                        Hasta
                      </Text>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="#000"
                        numberOfLines={1}>
                        Elige tu destino
                      </Text>
                    </Div>
                  </TouchableOpacity>
                </Div>
              </Div>
            </Div>

            <Button
              mt="3xl"
              rounded="lg"
              block
              onPress={() =>
                navigation.navigate('MeetYourDriverScreen', {
                  id: '123',
                })
              }>
              Meet your Driver
            </Button>
          </Div>
        </BottomSheetView>
      </BottomSheet>
    </Div>
  );
};

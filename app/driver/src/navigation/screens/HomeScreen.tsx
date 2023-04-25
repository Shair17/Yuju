import React from 'react';
import {Div, Image, Text, useTheme} from 'react-native-magnus';
import {FlashList} from '@shopify/flash-list';
import {HomeStackParams} from '../stacks/HomeStackScreen';
import {useIsActive} from '@yuju/global-hooks/useIsActive';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useGreeting} from '@yuju/global-hooks/useGreeting';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';
import {openLink} from '@yuju/common/utils/link';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {PendingRideItem} from '@yuju/components/molecules/PendingRideItem';

export const data = [
  {
    id: '123',
    user: {
      id: '1234509876543',
      facebookId: '1234567890',
      name: 'Jimmy Morales',
      email: 'hello@shair.dev',
      phoneNumber: '966107266',
      dni: '74408267',
      avatar: 'https://avatars.githubusercontent.com/u/18153674?v=4',
      isAdmin: false,
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
    from: {
      address: 'Ricardo Palma 200 Chequen',
      location: {
        latitude: -7.2312306766348655,
        longitude: -79.41698569669288,
      },
    },
    to: {
      address: 'Talambo',
      location: {
        latitude: -7.241504526019357,
        longitude: -79.40049305319835,
      },
    },
    passengersQuantity: 1,
    ridePrice: 3,
  },
  {
    id: '1222323456',
    user: {
      id: '1234509876543',
      facebookId: '1234567890',
      name: 'Jimmy Morales',
      email: 'hello@shair.dev',
      phoneNumber: '966107266',
      dni: '74408267',
      avatar: 'https://avatars.githubusercontent.com/u/18153674?v=4',
      isAdmin: false,
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
    from: {
      address: 'Ricardo Palma 200 Chequen',
      location: {
        latitude: -7.2312306766348655,
        longitude: -79.41698569669288,
      },
    },
    to: {
      address: 'Talambo',
      location: {
        latitude: -7.241504526019357,
        longitude: -79.40049305319835,
      },
    },
    passengersQuantity: 1,
    ridePrice: 3,
  },
  {
    id: '12345435456',
    user: {
      id: '1234509876543',
      facebookId: '1234567890',
      name: 'Jimmy Morales',
      email: 'hello@shair.dev',
      phoneNumber: '966107266',
      dni: '74408267',
      avatar: 'https://avatars.githubusercontent.com/u/18153674?v=4',
      isAdmin: false,
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
    from: {
      address: 'Ricardo Palma 200 Chequen',
      location: {
        latitude: -7.2312306766348655,
        longitude: -79.41698569669288,
      },
    },
    to: {
      address: 'Talambo',
      location: {
        latitude: -7.241504526019357,
        longitude: -79.40049305319835,
      },
    },
    passengersQuantity: 1,
    ridePrice: 3,
  },
  {
    id: '1253453456',
    user: {
      id: '1234509876543',
      facebookId: '1234567890',
      name: 'Jimmy Morales',
      email: 'hello@shair.dev',
      phoneNumber: '966107266',
      dni: '74408267',
      avatar: 'https://avatars.githubusercontent.com/u/18153674?v=4',
      isAdmin: false,
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
    from: {
      address: 'Ricardo Palma 200 Chequen',
      location: {
        latitude: -7.2312306766348655,
        longitude: -79.41698569669288,
      },
    },
    to: {
      address: 'Talambo',
      location: {
        latitude: -7.241504526019357,
        longitude: -79.40049305319835,
      },
    },
    passengersQuantity: 1,
    ridePrice: 3,
  },
  {
    id: '123534534456',
    user: {
      id: '1234509876543',
      facebookId: '1234567890',
      name: 'Jimmy Morales',
      email: 'hello@shair.dev',
      phoneNumber: '966107266',
      dni: '74408267',
      avatar: 'https://avatars.githubusercontent.com/u/18153674?v=4',
      isAdmin: false,
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
    from: {
      address: 'Ricardo Palma 200 Chequen',
      location: {
        latitude: -7.2312306766348655,
        longitude: -79.41698569669288,
      },
    },
    to: {
      address: 'Talambo',
      location: {
        latitude: -7.241504526019357,
        longitude: -79.40049305319835,
      },
    },
    passengersQuantity: 1,
    ridePrice: 3,
  },
  {
    id: '1234567565',
    user: {
      id: '1234509876543',
      facebookId: '1234567890',
      name: 'Jimmy Morales',
      email: 'hello@shair.dev',
      phoneNumber: '966107266',
      dni: '74408267',
      avatar: 'https://avatars.githubusercontent.com/u/18153674?v=4',
      isAdmin: false,
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
    from: {
      address: 'Ricardo Palma 200 Chequen',
      location: {
        latitude: -7.2312306766348655,
        longitude: -79.41698569669288,
      },
    },
    to: {
      address: 'Talambo',
      location: {
        latitude: -7.241504526019357,
        longitude: -79.40049305319835,
      },
    },
    passengersQuantity: 1,
    ridePrice: 3,
  },
];

interface Props extends NativeStackScreenProps<HomeStackParams, 'HomeScreen'> {}

export const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/drivers/me',
  });
  const {
    theme: {colors},
  } = useTheme();
  const greeting = useGreeting();
  const {isActive} = useIsActive();
  // const pendingRides = useSocketStore(s => s.pendingRides);

  const goToTripDetails = (id: string) => {
    // if (!isActive) return;

    navigation.navigate('TripDetailsScreen', {
      id,
    });
  };

  return (
    <FlashList
      estimatedItemSize={100}
      data={data}
      keyExtractor={({id}) => String(id)}
      contentContainerStyle={{
        backgroundColor: colors?.body,
        paddingBottom: 50,
      }}
      ListHeaderComponent={() => {
        return (
          <Div bg="body" px="2xl">
            <Div my="lg">
              <Div justifyContent="center">
                <Text fontSize="6xl" fontWeight="300" numberOfLines={1}>
                  {greeting}
                </Text>

                <Text fontSize="4xl" fontWeight="700" numberOfLines={1}>
                  {myProfile?.driver.profile.name}
                </Text>
              </Div>

              <Div mt="md">
                <Text fontSize="lg" color={isActive ? 'gray500' : 'red500'}>
                  {isActive
                    ? 'Aquí están las carreras disponibles para ti'
                    : 'Activa tu cuenta para tener acceso a todas las carreras disponibles para ti'}
                  .
                </Text>
              </Div>
            </Div>
          </Div>
        );
      }}
      ListFooterComponent={() => {
        return (
          <Div alignSelf="center" alignItems="center" mt="2xl">
            <Text
              fontSize={6}
              color="gray700"
              onPress={() => openLink('https://instagram.com/shair.dev')}>
              Desarrollado por{' '}
              <Text fontSize={6} color="gray700" fontWeight="500">
                @shair.dev
              </Text>
              .
            </Text>
          </Div>
        );
      }}
      ListEmptyComponent={() => {
        return (
          <Div py={128} alignItems="center" justifyContent="center" px="2xl">
            <Image
              source={require('@yuju/assets/images/frowning-face.png')}
              w={150}
              h={150}
            />
            <Text mt="xl" textAlign="center" fontSize="4xl" fontWeight="bold">
              No hay carreras disponibles
            </Text>
            <Text mt="md" textAlign="center" fontSize="lg" color="gray500">
              La lista se actualiza en tiempo real, en unos segundos o minutos
              aparecerán más carreras.
            </Text>
          </Div>
        );
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      renderItem={({
        item: {id, from, to, user, ridePrice, passengersQuantity},
        index,
      }) => {
        return (
          <PendingRideItem
            mt={index !== 0 ? 'lg' : 0}
            // disabled={!isActive}
            onPress={() => goToTripDetails(id)}
            id={id}
            from={from}
            to={to}
            user={user}
            ridePrice={ridePrice}
            passengersQuantity={passengersQuantity}
          />
        );
      }}
    />
  );
};

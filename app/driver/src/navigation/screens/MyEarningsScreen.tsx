import React, {useEffect} from 'react';
import {Div, Image, Skeleton, Text, useTheme} from 'react-native-magnus';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {RootDrawerParams} from '../drawer/Root';
import {usePagination} from '@yuju/global-hooks/usePagination';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {FlashList} from '@shopify/flash-list';
import {MyEarning, MyEarnings} from '@yuju/types/app';
import {TripsActivityScreenTripItem} from '@yuju/components/organisms/TripsActivityScreenTripItem';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {useLocation} from '@yuju/global-hooks/useLocation';

interface Props
  extends DrawerScreenProps<RootDrawerParams, 'MyEarningsScreen'> {}

export const MyEarningsScreen: React.FC<Props> = ({navigation, route}) => {
  const {
    theme: {colors},
  } = useTheme();
  const {isLoading: myEarningsTotalIsLoading, data: myEarningsTotal} =
    useRequest<MyEarnings>({
      method: 'GET',
      url: '/drivers/earnings/total',
    });
  const {
    myData: myEarnings,
    isLoading: myEarningsIsLoading,
    handleAddMoreItems,
  } = usePagination<MyEarning>({
    url: '/drivers/earnings',
  });
  const socket = useSocketStore(s => s.socket);
  const {userLocation} = useLocation();
  const shouldGoToRequestScreen = false;

  useEffect(() => {
    if (!shouldGoToRequestScreen) return;

    navigation.jumpTo('HomeStackScreen');
  }, [shouldGoToRequestScreen, navigation]);

  useEffect(() => {
    socket?.emit('DRIVER_LOCATION', userLocation);

    return () => {
      socket?.off('DRIVER_LOCATION');
    };
  }, [socket, userLocation]);

  if (myEarningsTotalIsLoading || myEarningsIsLoading || !myEarningsTotal) {
    return (
      <Div bg="body" flex={1} px="2xl">
        {[...Array(10).keys()].map((item, key) => (
          <Skeleton key={key} h={70} rounded="lg" mt="lg" p="lg" bg="gray100" />
        ))}
      </Div>
    );
  }

  if (!myEarningsTotal.earnings || myEarnings.length === 0) {
    return (
      <Div flex={1} alignItems="center" justifyContent="center" px="2xl">
        <Image
          source={require('@yuju/assets/images/frowning-face.png')}
          w={150}
          h={150}
        />
        <Text mt="xl" textAlign="center" fontSize="4xl" fontWeight="bold">
          Aún no tienes ganancias
        </Text>
        <Text
          mt="3xl"
          textAlign="center"
          maxW="70%"
          fontSize="xs"
          color="gray500">
          Es posible que tarden unos minutos en actualizarse tus ganancias.
        </Text>
      </Div>
    );
  }

  return (
    <FlashList
      estimatedItemSize={50}
      data={myEarnings}
      ListHeaderComponent={() => {
        return (
          <Div bg="body" px="2xl">
            <Div my="lg">
              <Div justifyContent="center">
                <Text fontSize="4xl">
                  Tu ganancia es de{' '}
                  <Text fontSize="4xl" fontWeight="bold" color="green500">
                    S/{myEarningsTotal.earnings}
                  </Text>
                </Text>
              </Div>

              <Div mt="md">
                <Text fontSize="lg" color="gray500">
                  Es posible que tarden unos minutos en actualizarse tus
                  ganancias.
                </Text>
              </Div>
            </Div>
          </Div>
        );
      }}
      renderItem={({
        item: {
          id,
          passengersQuantity,
          user,
          driver,
          rating,
          from,
          to,
          status,
          startTime,
          endTime,
          createdAt,
          updatedAt,
        },
      }) => {
        return (
          <TripsActivityScreenTripItem
            id={id}
            passengersQuantity={passengersQuantity}
            user={user}
            driver={driver}
            rating={rating}
            from={from}
            to={to}
            status={status}
            startTime={startTime}
            endTime={endTime}
            createdAt={createdAt}
            updatedAt={updatedAt}
            mx="2xl"
          />
        );
      }}
      keyExtractor={earning => earning.id}
      onEndReached={handleAddMoreItems}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{
        backgroundColor: colors?.body,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
};

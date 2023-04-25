import React from 'react';
import {Div, Image, Skeleton, Text, useTheme} from 'react-native-magnus';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {usePagination} from '@yuju/global-hooks/usePagination';
import {MyTrip} from '@yuju/types/app';
import {FlashList} from '@shopify/flash-list';
import {TripsActivityScreenTripItem} from '@yuju/components/organisms/TripsActivityScreenTripItem';
import {RootDrawerParams} from '../drawer/Root';

interface Props extends DrawerScreenProps<RootDrawerParams, 'MyTripsScreen'> {}

export const MyTripsScreen: React.FC<Props> = () => {
  const {
    theme: {colors},
  } = useTheme();
  const {
    myData: myTrips,
    isLoading,
    handleAddMoreItems,
  } = usePagination<MyTrip>({
    url: '/trips/drivers',
  });

  if (isLoading) {
    return (
      <Div bg="body" flex={1} px="2xl">
        {[...Array(10).keys()].map((item, key) => (
          <Skeleton key={key} h={70} rounded="lg" mt="lg" p="lg" bg="gray100" />
        ))}
      </Div>
    );
  }

  if (myTrips.length === 0) {
    return (
      <Div flex={1} alignItems="center" justifyContent="center" px="2xl">
        <Image
          source={require('@yuju/assets/images/frowning-face.png')}
          w={150}
          h={150}
        />
        <Text mt="xl" textAlign="center" fontSize="4xl" fontWeight="bold">
          Aún no tienes carreras
        </Text>
      </Div>
    );
  }

  return (
    <FlashList
      estimatedItemSize={50}
      data={myTrips}
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
      keyExtractor={trip => trip.id}
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

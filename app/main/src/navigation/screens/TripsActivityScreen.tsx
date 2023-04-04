import React from 'react';
import {Div, Image, Skeleton, Text, useTheme} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TripsActivityScreenTripItem} from '@yuju/components/organisms/TripsActivityScreenTripItem';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {usePagination} from '@yuju/global-hooks/usePagination';
import {FlashList} from '@shopify/flash-list';
import {MyTrip} from '@yuju/types/app';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'TripsActivityScreen'> {}

export const TripsActivityScreen: React.FC<Props> = ({navigation}) => {
  const {
    theme: {colors},
  } = useTheme();
  const {
    myData: myTrips,
    isLoading,
    handleAddMoreItems,
  } = usePagination<MyTrip>({
    url: '/trips/users',
  });

  if (isLoading) {
    return (
      <Div bg="body" flex={1} px="2xl">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, key) => (
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
          Aún no tienes viajes
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
      keyExtractor={report => report.id}
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

import React, {useEffect} from 'react';
import {Div, Image, Skeleton, Text, useTheme} from 'react-native-magnus';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {RootDrawerParams} from '../drawer/Root';
import {usePagination} from '@yuju/global-hooks/usePagination';
import {MyRating} from '@yuju/types/app';
import {FlashList} from '@shopify/flash-list';
import {MyRatingScreenRatingItem} from '@yuju/components/organisms/MyRatingScreenRatingItem';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {useLocation} from '@yuju/global-hooks/useLocation';

interface Props
  extends DrawerScreenProps<RootDrawerParams, 'MyRatingsScreen'> {}

export const MyRatingsScreen: React.FC<Props> = ({navigation}) => {
  const {
    theme: {colors},
  } = useTheme();
  const {
    myData: myRatings,
    isLoading,
    handleAddMoreItems,
  } = usePagination<MyRating>({
    url: '/ratings/drivers',
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

  if (isLoading) {
    return (
      <Div bg="body" flex={1} px="2xl">
        {[...Array(10).keys()].map((item, key) => (
          <Skeleton key={key} h={70} rounded="lg" mt="lg" p="lg" bg="gray100" />
        ))}
      </Div>
    );
  }

  if (myRatings.length === 0) {
    return (
      <Div flex={1} alignItems="center" justifyContent="center" px="2xl">
        <Image
          source={require('@yuju/assets/images/frowning-face.png')}
          w={150}
          h={150}
        />
        <Text mt="xl" textAlign="center" fontSize="4xl" fontWeight="bold">
          Aún no tienes calificaciones
        </Text>
      </Div>
    );
  }

  return (
    <FlashList
      estimatedItemSize={50}
      data={myRatings}
      renderItem={({
        item: {id, comment, value, driver, user, createdAt, updatedAt},
      }) => {
        return (
          <MyRatingScreenRatingItem
            id={id}
            comment={comment}
            value={value}
            driver={driver}
            user={user}
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

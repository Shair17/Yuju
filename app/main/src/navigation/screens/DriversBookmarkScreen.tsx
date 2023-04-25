import React from 'react';
import {Div, Image, Skeleton, Text, useTheme} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {FlashList} from '@shopify/flash-list';
import {usePagination} from '@yuju/global-hooks/usePagination';
import {MyDriver} from '@yuju/types/app';
import {DriversBookMarkScreenDriverItem} from '@yuju/components/organisms/DriversBookMarkScreenDriverItem';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'DriversBookmarkScreen'> {}

export const DriversBookmarkScreen: React.FC<Props> = () => {
  const {
    theme: {colors},
  } = useTheme();
  const {
    myData: myDrivers,
    isLoading,
    handleAddMoreItems,
  } = usePagination<MyDriver>({
    url: '/users/my-drivers',
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

  if (myDrivers.length === 0) {
    return (
      <Div flex={1} alignItems="center" justifyContent="center" px="2xl">
        <Image
          source={require('@yuju/assets/images/frowning-face.png')}
          w={150}
          h={150}
        />
        <Text mt="xl" textAlign="center" fontSize="4xl" fontWeight="bold">
          Aún no tienes mototaxistas guardados
        </Text>
      </Div>
    );
  }

  return (
    <FlashList
      estimatedItemSize={50}
      data={myDrivers}
      renderItem={({item: {id, profile, rating, createdAt, updatedAt}}) => {
        return (
          <DriversBookMarkScreenDriverItem
            id={id}
            profile={profile}
            rating={rating}
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

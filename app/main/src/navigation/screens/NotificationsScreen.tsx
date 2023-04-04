import React from 'react';
import {Div, Text, Image, Skeleton, Icon, useTheme} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {HomeStackParams} from '../bottom-tabs/HomeStackScreen';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {Notification} from '@yuju/types/app';
import {FlashList} from '@shopify/flash-list';
import {NotificationScreenNotificationItem} from '@yuju/components/organisms/NotificationScreenNotificationItem';

interface Props
  extends NativeStackScreenProps<
    HomeStackParams | ProfileStackParams,
    'NotificationsScreen'
  > {}

export const NotificationsScreen: React.FC<Props> = ({navigation}) => {
  const {
    theme: {colors},
  } = useTheme();
  const {data: notifications, isLoading} = useRequest<Notification[]>({
    method: 'GET',
    url: '/notifications',
  });

  if (isLoading || !notifications) {
    return (
      <Div bg="body" flex={1} px="2xl">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, key) => (
          <Skeleton key={key} h={70} rounded="lg" mt="lg" p="lg" bg="gray100" />
        ))}
      </Div>
    );
  }

  if (notifications?.length === 0) {
    return (
      <Div flex={1} alignItems="center" justifyContent="center" px="2xl">
        <Image
          source={require('@yuju/assets/images/frowning-face.png')}
          w={150}
          h={150}
        />
        <Text mt="xl" textAlign="center" fontSize="4xl" fontWeight="bold">
          Aún no tienes notificaciones
        </Text>
      </Div>
    );
  }

  return (
    <FlashList
      estimatedItemSize={50}
      keyExtractor={notification => notification.id}
      contentContainerStyle={{
        backgroundColor: colors?.body,
        paddingBottom: 100,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      data={notifications}
      renderItem={({item: {id, title, description}}) => {
        return (
          <NotificationScreenNotificationItem
            key={id}
            title={title}
            description={description}
            mx="2xl"
          />
        );
      }}
    />
  );
};

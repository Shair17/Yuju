import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {FlashList} from '@shopify/flash-list';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ProfileStackParams,
  ProfileStackParamsValue,
} from '../bottom-tabs/ProfileStackScreen';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'TripsActivityScreen'> {}

const DATA = [
  {
    title: 'First Item',
  },
  {
    title: 'Second Item',
  },
];

export const TripsActivityScreen: React.FC<Props> = ({navigation}) => {
  const navigateTo = (screen: ProfileStackParamsValue, params?: any) => {
    navigation.navigate(screen, params);
  };

  return (
    <FlashList
      data={DATA}
      renderItem={({item}) => <Text>{item.title}</Text>}
      estimatedItemSize={200}
    />
  );
};

import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ProfileStackParams,
  ProfileStackParamsValue,
} from '../bottom-tabs/ProfileStackScreen';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'TripsActivityScreen'> {}

export const TripsActivityScreen: React.FC<Props> = ({navigation}) => {
  const navigateTo = (screen: ProfileStackParamsValue) => {
    navigation.navigate(screen);
  };

  return (
    <Div bg="body">
      <Text>TripsActivityScreen</Text>
    </Div>
  );
};

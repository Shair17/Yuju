import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {HomeStackParams} from '../bottom-tabs/HomeStackScreen';

interface Props
  extends NativeStackScreenProps<
    HomeStackParams | ProfileStackParams,
    'NotificationsScreen'
  > {}

export const NotificationsScreen: React.FC<Props> = ({navigation}) => {
  return (
    <Div bg="body">
      <Text>NotificationsScreen</Text>
    </Div>
  );
};

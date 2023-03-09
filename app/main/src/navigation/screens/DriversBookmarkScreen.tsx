import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'DriversBookmarkScreen'> {}

export const DriversBookmarkScreen: React.FC<Props> = () => {
  return (
    <Div bg="body">
      <Text>DriversBookmarkScreen</Text>
    </Div>
  );
};

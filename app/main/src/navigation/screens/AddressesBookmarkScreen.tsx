import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ProfileStackParams,
  ProfileStackParamsValue,
} from '../bottom-tabs/ProfileStackScreen';

interface Props
  extends NativeStackScreenProps<
    ProfileStackParams,
    'AddressesBookmarkScreen'
  > {}

export const AddressesBookmarkScreen: React.FC<Props> = ({navigation}) => {
  return (
    <Div bg="body">
      <Text>AddressesBookmarkScreen</Text>
    </Div>
  );
};

import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'LanguageScreen'> {}

export const LanguageScreen: React.FC<Props> = () => {
  return (
    <Div bg="body">
      <Text>LanguageScreen</Text>
    </Div>
  );
};

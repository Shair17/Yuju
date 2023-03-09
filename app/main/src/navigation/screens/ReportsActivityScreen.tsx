import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'ReportsActivityScreen'> {}

export const ReportsActivityScreen: React.FC<Props> = ({navigation}) => {
  return (
    <Div bg="body">
      <Text>ReportsActivityScreen</Text>
    </Div>
  );
};

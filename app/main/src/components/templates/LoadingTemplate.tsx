import React from 'react';
import {StatusBar} from 'react-native';
import {Div} from 'react-native-magnus';
import {ActivityIndicator} from '../atoms/ActivityIndicator';
import {DevelopedByShair} from '../atoms/DevelopedByShair';

interface Props {}

export const LoadingTemplate: React.FC<Props> = () => {
  return (
    <Div flex={1} bg="body" alignItems="center" justifyContent="center">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ActivityIndicator />
      <DevelopedByShair />
    </Div>
  );
};

import React from 'react';
import {LoadingTemplate} from '@yuju/components/templates/LoadingTemplate';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'LoadingScreen'> {}

export const LoadingScreen: React.FC<Props> = () => {
  return <LoadingTemplate />;
};

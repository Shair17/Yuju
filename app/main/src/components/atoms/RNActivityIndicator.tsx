import React from 'react';
import {ActivityIndicator, ActivityIndicatorProps} from 'react-native';
import {useTheme} from 'react-native-magnus';

interface Props extends ActivityIndicatorProps {}

export const RNActivityIndicator: React.FC<Props> = ({...rest}) => {
  const {theme} = useTheme();

  return (
    <ActivityIndicator color={theme.colors?.secondary ?? '#3d5af1'} {...rest} />
  );
};

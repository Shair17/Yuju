import React from 'react';
import {ViewProps} from 'react-native';
import {useTheme} from 'react-native-magnus';
import {Bounce} from 'react-native-animated-spinkit';

interface Props extends ViewProps {
  size?: number;
  color?: string;
  animating?: boolean;
  hidesWhenStopped?: boolean;
}

export const ActivityIndicator: React.FC<Props> = props => {
  const {theme} = useTheme();

  return <Bounce color={theme.colors?.primary500 ?? '#3d5af1'} {...props} />;
};

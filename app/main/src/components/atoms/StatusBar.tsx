import React from 'react';
import {useTheme} from 'react-native-magnus';
import {StatusBar as RNStatusBar, StatusBarProps} from 'react-native';

interface Props extends StatusBarProps {}

export const StatusBarCurrentHeight = RNStatusBar.currentHeight;

export const StatusBar: React.FC<Props> = props => {
  const {theme} = useTheme();

  return (
    <RNStatusBar
      backgroundColor={theme.name === 'dark' ? '#000' : '#fff'}
      barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'}
      {...props}
    />
  );
};

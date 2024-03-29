import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';

export const Navigation: React.FC<React.PropsWithChildren> = ({children}) => (
  <NavigationContainer
    onReady={() => {
      BootSplash.hide({fade: true});
    }}>
    {children}
  </NavigationContainer>
);

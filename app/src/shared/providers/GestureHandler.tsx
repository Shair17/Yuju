import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export const GestureHandler: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <GestureHandlerRootView style={{flex: 1}}>{children}</GestureHandlerRootView>
);

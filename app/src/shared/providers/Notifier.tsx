import React from 'react';
import {NotifierWrapper} from 'react-native-notifier';

export const Notifier: React.FC<React.PropsWithChildren> = ({children}) => (
  <NotifierWrapper>{children}</NotifierWrapper>
);

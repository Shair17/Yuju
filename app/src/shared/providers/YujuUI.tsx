import React from 'react';
import {ThemeProvider} from '@yuju/modules/yuju-ui';

export const YujuUI: React.FC<React.PropsWithChildren> = ({children}) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

import React, {Fragment} from 'react';
import {useColorScheme} from 'react-native';
import {StatusBar, ThemeProvider} from '@yuju/modules/ui';

export const YujuUI: React.FC<React.PropsWithChildren> = ({children}) => {
  const colorMode = useColorScheme();
  const isDarkMode = colorMode === 'dark';

  return (
    <Fragment>
      <StatusBar
        backgroundColor={isDarkMode ? '#000' : '#fff'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <ThemeProvider>{children}</ThemeProvider>
    </Fragment>
  );
};

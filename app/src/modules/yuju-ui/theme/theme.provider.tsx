import {Fragment} from 'react';
import {useColorScheme, StatusBar} from 'react-native';
import {DripsyProvider} from 'dripsy';
import {darkTheme, lightTheme} from './theme.style';

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const colorMode = useColorScheme();
  const isDarkMode = colorMode === 'dark';

  return (
    <Fragment>
      <StatusBar
        backgroundColor={isDarkMode ? '#000' : '#fff'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <DripsyProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {children}
      </DripsyProvider>
    </Fragment>
  );
};

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider} from 'react-native-magnus';
import {Root as RootNavigation} from '@yuju/navigation/Root';
import {lightTheme} from '@yuju/theme/lightTheme';
import {darkTheme} from '@yuju/theme/darkTheme';
import {useCheckLocationPermissions} from './global-hooks/useCheckLocationPermissions';
import {useInitialTheme} from './global-hooks/useInitialTheme';
import {NotifierWrapper} from 'react-native-notifier';
import {SocketProvider} from './mods/socket/SocketProvider';
import {SWRProvider} from './mods/swr/SWRProvider';
import {enableLatestRenderer} from 'react-native-maps';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import mobileAds from 'react-native-google-mobile-ads';
import {globalStyles} from './styles/globals';

mobileAds().initialize();

enableLatestRenderer();

const App: React.FC = () => {
  useCheckLocationPermissions();
  const {themeName, isDarkTheme} = useInitialTheme();

  const theme = isDarkTheme ? darkTheme : lightTheme;

  useEffect(() => {
    if (themeName === 'dark') {
      StatusBar.setBackgroundColor('#000');
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBackgroundColor('#fff');
      StatusBar.setBarStyle('dark-content');
    }
  }, [themeName]);

  return (
    <GestureHandlerRootView style={globalStyles.container}>
      <SWRProvider>
        <SocketProvider>
          <NotifierWrapper>
            <ThemeProvider theme={theme}>
              <BottomSheetModalProvider>
                <NavigationContainer
                  onReady={() => RNBootSplash.hide({fade: true})}>
                  <RootNavigation />
                </NavigationContainer>
              </BottomSheetModalProvider>
            </ThemeProvider>
          </NotifierWrapper>
        </SocketProvider>
      </SWRProvider>
    </GestureHandlerRootView>
  );
};

export default App;

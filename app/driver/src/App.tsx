import React, {useEffect} from 'react';
import {AppState, StatusBar, type AppStateStatus} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import RNBootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SWRConfig} from 'swr';
import {ThemeProvider} from 'react-native-magnus';
import {Root as RootNavigation} from '@yuju/navigation/Root';
import {lightTheme} from '@yuju/theme/lightTheme';
import {darkTheme} from '@yuju/theme/darkTheme';
import {useAppState} from './global-hooks/useAppState';
import {useCheckLocationPermissions} from './global-hooks/useCheckLocationPermissions';
import {useInitialTheme} from './global-hooks/useInitialTheme';
import {NotifierWrapper} from 'react-native-notifier';
import {SocketProvider} from './mods/socket/SocketProvider';
import {enableLatestRenderer} from 'react-native-maps';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import mobileAds from 'react-native-google-mobile-ads';

mobileAds().initialize();

enableLatestRenderer();

const App: React.FC = () => {
  useCheckLocationPermissions();
  const {themeName, isDarkTheme} = useInitialTheme();
  const netInfo = useNetInfo();
  const appState = useAppState();
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
    <GestureHandlerRootView style={{flex: 1}}>
      <SWRConfig
        value={{
          isPaused() {
            return appState !== 'active';
          },
          provider: () => new Map(),
          isOnline() {
            return !!netInfo.isConnected;
          },
          isVisible() {
            return appState === 'active' || appState === 'background';
          },
          initFocus(callback) {
            let appState = AppState.currentState;

            const onAppStateChange = (nextAppState: AppStateStatus) => {
              if (
                appState.match(/inactive|background/) &&
                nextAppState === 'active'
              ) {
                callback();
              }
              appState = nextAppState;
            };

            const subscription = AppState.addEventListener(
              'change',
              onAppStateChange,
            );

            return () => {
              subscription.remove();
            };
          },
          initReconnect(callback) {
            if (netInfo.isConnected === null) return;

            let isOnline = !!netInfo.isConnected;

            if (isOnline) {
              callback();
            }

            const unsubscribe = NetInfo.addEventListener(nextState => {
              if (!!nextState.isConnected) {
                callback();
              }

              isOnline = !!nextState.isConnected;
            });

            return () => {
              unsubscribe();
            };
          },
        }}>
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
      </SWRConfig>
    </GestureHandlerRootView>
  );
};

export default App;

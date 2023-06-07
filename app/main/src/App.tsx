import React, {useEffect, useState, useRef} from 'react';
import {StatusBar, Animated, StyleSheet, Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Div, Text, ThemeProvider} from 'react-native-magnus';
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

const bootSplashLogo = require('@yuju/assets/logo.png');

RNBootSplash.hide();

mobileAds().initialize();

enableLatestRenderer();

const App: React.FC = () => {
  useCheckLocationPermissions();
  const {themeName, isDarkTheme} = useInitialTheme();
  const theme = isDarkTheme ? darkTheme : lightTheme;

  const [bootSplashIsVisible, setBootSplashIsVisible] = useState<boolean>(true);
  const [bootSplashLogoIsLoaded, setBootSplashLogoIsLoaded] =
    useState<boolean>(false);
  const opacityRef = useRef<Animated.Value>(new Animated.Value(1));
  const translateYRef = useRef<Animated.Value>(new Animated.Value(0));

  const init = async () => {
    try {
      Animated.stagger(250, [
        Animated.spring(translateYRef.current, {
          useNativeDriver: true,
          toValue: -50,
        }),
        Animated.spring(translateYRef.current, {
          useNativeDriver: true,
          toValue: Dimensions.get('window').height,
        }),
      ]).start();

      Animated.timing(opacityRef.current, {
        useNativeDriver: true,
        toValue: 0,
        duration: 150,
        delay: 350,
      }).start(() => {
        setBootSplashIsVisible(false);
      });
    } catch (error) {
      setBootSplashIsVisible(false);
    }
  };

  useEffect(() => {
    if (bootSplashLogoIsLoaded) {
      init();
    }
  }, [bootSplashLogoIsLoaded]);

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
                  onReady={() => {
                    // RNBootSplash.hide({fade: true});
                    setBootSplashLogoIsLoaded(true);
                  }}>
                  <RootNavigation />
                </NavigationContainer>
              </BottomSheetModalProvider>

              {bootSplashIsVisible && (
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                    },
                    {opacity: opacityRef.current},
                  ]}>
                  <Animated.Image
                    source={bootSplashLogo}
                    fadeDuration={0}
                    resizeMode="contain"
                    // onLoadEnd={() => setBootSplashLogoIsLoaded(true)}
                    style={[
                      {width: 110, height: 110},
                      {transform: [{translateY: translateYRef.current}]},
                    ]}
                  />

                  <Div
                    position="absolute"
                    bottom={20}
                    alignSelf="center"
                    alignItems="center">
                    <Text fontSize="md" color="gray700">
                      Desarrollado por{' '}
                      <Text fontSize="md" color="black" fontWeight="bold">
                        @shair.dev
                      </Text>
                    </Text>
                  </Div>
                </Animated.View>
              )}
            </ThemeProvider>
          </NotifierWrapper>
        </SocketProvider>
      </SWRProvider>
    </GestureHandlerRootView>
  );
};

export default App;

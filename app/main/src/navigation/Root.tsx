import React, {useEffect} from 'react';
import {useTheme} from 'react-native-magnus';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnBoardingScreen} from './screens/OnBoardingScreen';
import {AuthenticationScreen} from './screens/AuthenticationScreen';
import {UpdateAppScreen} from './screens/UpdateAppScreen';
import {LoadingScreen} from './screens/LoadingScreen';
import {GeolocationPermissionsScreen} from './screens/GeolocationPermissionsScreen';
import {PrivacyPolicyScreen} from './screens/PrivacyPolicyScreen';
import {TermsOfUseScreen} from './screens/TermsOfUseScreen';
import {ConnectionErrorScreen} from './screens/ConnectionErrorScreen';
import {WelcomeNewUserScreen} from './screens/WelcomeNewUserScreen';
import {AskReferralCodeScreen} from './screens/AskReferralCodeScreen';
import {AskAvatarScreen} from './screens/AskAvatarScreen';
import {AskProfileDataScreen} from './screens/AskProfileDataScreen';
import {Root as RootAppBottomTabs} from './bottom-tabs/Root';
import {useShouldUpdate} from '@yuju/global-hooks/useShouldUpdate';
import {useIsConnected} from '@yuju/global-hooks/useIsConnected';
import {useShowNoConnection} from '@yuju/global-hooks/useShowNoConnection';
import {useSessionIsExpired} from '@yuju/global-hooks/useSessionExpired';
import {useIsAuthenticated} from '@yuju/global-hooks/useIsAuthenticated';
import {usePermissionsStore} from '@yuju/global-stores/usePermissionsStore';
import {useIsNew} from '@yuju/global-hooks/useIsNew';
import {MinigameScreen} from './screens/MinigameScreen';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {useLocation} from '@yuju/global-hooks/useLocation';

export type RootStackParams = {
  /**
   * Neutral
   */
  LoadingScreen: undefined;
  UpdateAppScreen: undefined;
  PrivacyPolicyScreen: undefined;
  TermsOfUseScreen: undefined;
  ConnectionErrorScreen: undefined;
  MinigameScreen: undefined;

  /**
   * Unauthenticated
   */
  OnBoardingScreen: undefined;
  AuthenticationScreen: undefined;

  /**
   * Authenticated
   */
  GeolocationPermissionsScreen: undefined;
  WelcomeNewUserScreen: undefined;
  AskReferralCodeScreen: undefined;
  AskAvatarScreen: {
    referralCode?: string;
  };
  AskProfileDataScreen: {
    avatar?: string;
    referralCode?: string;
  };

  Application: undefined;
};

export type RootStackParamsValue = keyof RootStackParams;

const RootStack = createNativeStackNavigator<RootStackParams>();

export const Root: React.FC = () => {
  useShowNoConnection();
  useSessionIsExpired();

  const isAuthenticated = useIsAuthenticated();
  const isNew = useIsNew();
  const locationStatus = usePermissionsStore(s => s.locationStatus);
  const isConnected = useIsConnected();
  const socket = useSocketStore(s => s.socket);
  const socketStatus = useSocketStore(s => s.status);
  const appShouldUpdate = useShouldUpdate();
  const {theme} = useTheme();
  const {userLocation} = useLocation();
  const appIsLoading =
    locationStatus === 'unavailable' ||
    isConnected === 'loading' ||
    appShouldUpdate === 'loading' ||
    socketStatus === 'loading';
  const appHasErrors =
    isConnected === 'disconnected' || socketStatus === 'offline';
  // appShouldUpdate === 'error';

  useEffect(() => {
    if (!isAuthenticated || isNew) {
      return;
    }

    socket?.emit('PASSENGER_LOCATION', userLocation);

    return () => {
      socket?.off('PASSENGER_LOCATION');
    };
  }, [socket, isAuthenticated, isNew, userLocation]);

  return (
    <RootStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors?.body,
        },
      }}>
      {isAuthenticated ? (
        <RootStack.Group
          screenOptions={{
            contentStyle: {
              backgroundColor: theme.colors?.body,
            },
            animation: 'slide_from_right',
          }}>
          {appIsLoading ? (
            <RootStack.Screen
              name="LoadingScreen"
              component={LoadingScreen}
              options={{
                headerShown: false,
              }}
            />
          ) : locationStatus !== 'granted' ? (
            <RootStack.Screen
              name="GeolocationPermissionsScreen"
              component={GeolocationPermissionsScreen}
              options={{
                headerShown: false,
              }}
            />
          ) : appHasErrors ? (
            <RootStack.Group
              screenOptions={{
                contentStyle: {
                  backgroundColor: theme.colors?.body,
                },
                animation: 'slide_from_right',
              }}>
              <RootStack.Screen
                name="ConnectionErrorScreen"
                component={ConnectionErrorScreen}
                options={{
                  headerShown: false,
                }}
              />
              <RootStack.Screen
                name="MinigameScreen"
                component={MinigameScreen}
                options={{
                  headerShown: false,
                }}
              />
            </RootStack.Group>
          ) : appShouldUpdate === 'needs-update' ? (
            <RootStack.Screen
              name="UpdateAppScreen"
              component={UpdateAppScreen}
              options={{
                animation: 'slide_from_right',
                headerShown: false,
              }}
            />
          ) : isNew ? (
            <RootStack.Group
              screenOptions={{
                headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                animation: 'slide_from_right',
                contentStyle: {
                  backgroundColor: theme.colors?.body,
                },
              }}>
              <RootStack.Screen
                name="WelcomeNewUserScreen"
                component={WelcomeNewUserScreen}
                options={{
                  headerTitle: '¡Bienvenido a Yuju!',
                }}
              />
              <RootStack.Screen
                name="AskReferralCodeScreen"
                component={AskReferralCodeScreen}
                options={{
                  title: '¿Tienes un código?',
                }}
              />
              <RootStack.Screen
                name="AskAvatarScreen"
                component={AskAvatarScreen}
                options={{
                  title: 'Agregar Foto de Perfil',
                }}
              />
              <RootStack.Screen
                name="AskProfileDataScreen"
                component={AskProfileDataScreen}
                options={{
                  title: 'Completa tu Perfil',
                }}
              />
            </RootStack.Group>
          ) : (
            <RootStack.Screen
              name="Application"
              component={RootAppBottomTabs}
              options={{
                headerShown: false,
              }}
            />
          )}
        </RootStack.Group>
      ) : (
        <RootStack.Group
          screenOptions={{
            headerShown: false,
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            animation: 'fade_from_bottom',
            contentStyle: {
              backgroundColor: theme.colors?.body,
            },
          }}>
          <RootStack.Screen
            name="OnBoardingScreen"
            component={OnBoardingScreen}
          />
          <RootStack.Screen
            name="AuthenticationScreen"
            component={AuthenticationScreen}
          />
          <RootStack.Screen
            name="UpdateAppScreen"
            component={UpdateAppScreen}
          />
          <RootStack.Screen
            name="PrivacyPolicyScreen"
            component={PrivacyPolicyScreen}
            options={{headerShown: true}}
          />
          <RootStack.Screen
            name="TermsOfUseScreen"
            component={TermsOfUseScreen}
            options={{headerShown: true}}
          />
        </RootStack.Group>
      )}
    </RootStack.Navigator>
  );
};

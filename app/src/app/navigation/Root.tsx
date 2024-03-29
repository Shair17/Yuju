import React, {Fragment} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {WelcomeScreen} from '../screens/WelcomeScreen';
// import {
//   RootTabParamsList,
//   Root as RootTabs,
// } from '../navigation/bottom-tab/Root';
// import {AuthWithEmailScreen} from '../screens/Auth/Email/AuthWithEmailScreen';
// import {AuthWithPhoneScreen} from '../screens/Auth/Phone/AuthWithPhoneScreen';
// import {AuthAskNameScreen} from '../screens/Auth/AuthAskNameScreen';
// import {AuthEnterPasswordScreen} from '../screens/Auth/Email/AuthEnterPasswordScreen';
// import {SearchScreen} from '../screens/App/Explore/SearchScreen';
// import {NavigatorScreenParams} from '@react-navigation/native';
import {useCleanInstall} from '@yuju/shared/storage/hooks/useCleanInstall';
import {useAuth} from '@yuju/modules/auth/hooks/useAuth';
import {LoadingScreen} from '../screens/LoadingScreen';
// import {AuthBottomSheet} from '@rentit/modules/auth/components/AuthBottomSheet';
import {usePermissionsStore} from '@yuju/modules/location/stores/usePermissionsStore';
import {useIsNetworkConnected} from '@yuju/shared/hooks/useIsNetworkConnected';
import {LocationPermissionsBottomSheet} from '@yuju/modules/location/components/LocationPermissionsBottomSheet';
import {Box, Text} from '@yuju/modules/yuju-ui';
// import {CreateWishListBottomSheet} from '@rentit/modules/wishlist/components/CreateWishListBottomSheet';
// import {AuthAskPhoneOTPCodeScreen} from '../screens/Auth/Phone/AuthAskPhoneOTPCodeScreen';
// import {AuthWithFacebookScreen} from '../screens/Auth/Facebook/AuthWithFacebookScreen';
// import {AuthWithGoogleScreen} from '../screens/Auth/Google/AuthWithGoogleScreen';

const App = () => {
  return (
    <Box>
      <Text>App</Text>
    </Box>
  );
};

export type RootStackParamsList = {
  LoadingScreen: undefined;

  WelcomeScreen: undefined;
  App: undefined;
  // RootTabs: NavigatorScreenParams<RootTabParamsList>;

  // SearchScreen: undefined;

  /* Auth */

  // email
  // AuthWithEmailScreen: undefined;
  // AuthEnterPasswordScreen: {
  //   firstName?: string;
  //   lastName?: string;
  //   email: string;
  // };
  // phone
  // AuthWithPhoneScreen: undefined;
  // AuthAskPhoneOTPCodeScreen: {
  //   phone: string;
  // };
  // ask firstName and lastName
  // AuthAskNameScreen: {
  //   type: 'email' | 'phone' | 'google';
  //   value: string;
  // };
  // AuthWithFacebookScreen: undefined;
  // AuthWithGoogleScreen: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamsList>();

export const Root: React.FC = () => {
  const {hasCleanInstall} = useCleanInstall();
  const {isAuthenticated, isLoading: authIsLoading} = useAuth();
  const isNetworkConnected = useIsNetworkConnected();
  const locationStatus = usePermissionsStore(s => s.locationStatus);
  const appIsLoading =
    isNetworkConnected === 'loading' ||
    authIsLoading ||
    locationStatus === 'unavailable';

  return (
    <Fragment>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#fff'},
          animation: 'slide_from_right',
        }}>
        {hasCleanInstall ? (
          <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        ) : (
          <RootStack.Group>
            {appIsLoading ? (
              <RootStack.Screen
                name="LoadingScreen"
                component={LoadingScreen}
                options={{animation: 'fade'}}
              />
            ) : (
              <RootStack.Group>
                <RootStack.Screen
                  name="App"
                  component={App}
                  options={{animation: 'fade'}}
                />

                {/** Auth */}
                {/* {!isAuthenticated ? (
                  <RootStack.Group
                    screenOptions={{
                      headerShown: true,
                      headerShadowVisible: false,
                      headerBackTitleVisible: false,
                      headerLargeTitleShadowVisible: false,
                    }}>
                    <RootStack.Screen
                      name="AuthWithEmailScreen"
                      component={AuthWithEmailScreen}
                      options={{
                        title: 'Continuar con correo',
                      }}
                    />
                    <RootStack.Screen
                      name="AuthEnterPasswordScreen"
                      component={AuthEnterPasswordScreen}
                      options={{
                        title: 'Ingresa tu contraseña',
                      }}
                    />

                    <RootStack.Screen
                      name="AuthWithPhoneScreen"
                      component={AuthWithPhoneScreen}
                      options={{
                        title: 'Continuar con teléfono',
                      }}
                    />

                    <RootStack.Screen
                      name="AuthAskPhoneOTPCodeScreen"
                      component={AuthAskPhoneOTPCodeScreen}
                      options={{
                        title: 'Ingresa el código OTP',
                      }}
                    />

                    <RootStack.Screen
                      name="AuthAskNameScreen"
                      component={AuthAskNameScreen}
                      options={{
                        title: 'Ingresa tus datos',
                      }}
                    />

                    <RootStack.Screen
                      name="AuthWithFacebookScreen"
                      component={AuthWithFacebookScreen}
                      options={{
                        title: 'Continuar con Facebook',
                      }}
                    />

                    <RootStack.Screen
                      name="AuthWithGoogleScreen"
                      component={AuthWithGoogleScreen}
                      options={{
                        title: 'Continuar con Google',
                      }}
                    />
                  </RootStack.Group>
                ) : null} */}
              </RootStack.Group>
            )}
          </RootStack.Group>
        )}
      </RootStack.Navigator>

      {/** Bottom Sheets */}
      {/* <AuthBottomSheet /> */}
      <LocationPermissionsBottomSheet />
    </Fragment>
  );
};

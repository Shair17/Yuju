import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootTabsParams} from './Root';
import {RequestScreen} from '../screens/RequestScreen';
import {useTheme} from 'react-native-magnus';
import {QrCodeScreen} from '../screens/QrCodeScreen';
import {MeetYourDriverScreen} from '../screens/MeetYourDriverScreen';
import {ChooseStartingLocationScreen} from '../screens/ChooseStartingLocationScreen';
import {ChooseDestinationLocationScreen} from '../screens/ChooseDestinationLocationScreen';

export type RequestStackParams = {
  RequestScreen: undefined;
  ChooseStartingLocationScreen: undefined;
  ChooseDestinationLocationScreen: undefined;
  QrCodeScreen: undefined;
  MeetYourDriverScreen: {
    id: string;
  };
};

export type RequestStackParamsValue = keyof RequestStackParams;

const RequestStack = createNativeStackNavigator<RequestStackParams>();

interface Props
  extends BottomTabScreenProps<RootTabsParams, 'RequestStackScreen'> {}

export const RequestStackScreen: React.FC<Props> = () => {
  const {theme} = useTheme();

  return (
    <RequestStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: '700',
        },
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: theme.colors?.body,
        },
      }}
      // initialRouteName="RequestScreen"
    >
      <RequestStack.Screen
        name="RequestScreen"
        component={RequestScreen}
        options={{headerShown: false}}
      />

      <RequestStack.Screen
        name="ChooseStartingLocationScreen"
        component={ChooseStartingLocationScreen}
        options={{
          title: 'Elegir Ubicación de Partida',
          animation: 'slide_from_bottom',
        }}
      />

      <RequestStack.Screen
        name="ChooseDestinationLocationScreen"
        component={ChooseDestinationLocationScreen}
        options={{
          title: 'Elegir Ubicación de Destino',
          animation: 'slide_from_bottom',
        }}
      />

      <RequestStack.Screen
        name="MeetYourDriverScreen"
        component={MeetYourDriverScreen}
        options={{
          title: 'Conoce a tu Mototaxista',
        }}
      />
      <RequestStack.Screen
        name="QrCodeScreen"
        component={QrCodeScreen}
        options={{headerShown: false}}
      />
    </RequestStack.Navigator>
  );
};

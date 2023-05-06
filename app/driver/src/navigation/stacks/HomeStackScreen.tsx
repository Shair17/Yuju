import React, {useEffect} from 'react';
import {useTheme} from 'react-native-magnus';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {RootDrawerParams} from '../drawer/Root';
import {HomeScreen} from '../screens/HomeScreen';
import {TripDetailsScreen} from '../screens/TripDetailsScreen';
import {TripScreen} from '../screens/TripScreen';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {useLocation} from '@yuju/global-hooks/useLocation';

export type HomeStackParams = {
  HomeScreen: undefined;
  TripDetailsScreen: {
    id: string;
    isNearPassenger?: boolean;
  };
  TripScreen: {
    id: string;
  };
};

export type HomeStackParamsValue = keyof HomeStackParams;

const HomeStack = createNativeStackNavigator<HomeStackParams>();

interface Props
  extends DrawerScreenProps<RootDrawerParams, 'HomeStackScreen'> {}

export const HomeStackScreen: React.FC<Props> = ({navigation}) => {
  const {theme} = useTheme();
  const socket = useSocketStore(s => s.socket);
  const {userLocation} = useLocation();
  const shouldGoToRequestScreen = false;

  useEffect(() => {
    if (!shouldGoToRequestScreen) return;

    navigation.jumpTo('HomeStackScreen');
  }, [shouldGoToRequestScreen, navigation]);

  useEffect(() => {
    socket?.emit('DRIVER_LOCATION', userLocation);

    return () => {
      socket?.off('DRIVER_LOCATION');
    };
  }, [socket, userLocation]);

  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: theme.colors?.body,
        },
        animation: 'slide_from_right',
        headerShadowVisible: false,
        headerShown: false,
      }}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="TripDetailsScreen"
        component={TripDetailsScreen}
        options={{headerShown: false, animation: 'fade_from_bottom'}}
      />
      <HomeStack.Screen
        name="TripScreen"
        component={TripScreen}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

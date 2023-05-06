import React, {useEffect} from 'react';
import {useTheme} from 'react-native-magnus';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {RootDrawerParams} from '../drawer/Root';
import {ReferralsScreen} from '../screens/ReferralsScreen';
import {MyReferralsScreen} from '../screens/MyReferralsScreen';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {useLocation} from '@yuju/global-hooks/useLocation';

export type ReferralsStackParams = {
  ReferralsScreen: undefined;
  MyReferralsScreen: undefined;
};

export type ReferralsStackParamsValue = keyof ReferralsStackParams;

const ReferralsStack = createNativeStackNavigator<ReferralsStackParams>();

interface Props
  extends DrawerScreenProps<RootDrawerParams, 'ReferralsStackScreen'> {}

export const ReferralsStackScreen: React.FC<Props> = ({navigation}) => {
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
    <ReferralsStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors?.body,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
        animation: 'fade_from_bottom',
      }}>
      <ReferralsStack.Screen
        name="ReferralsScreen"
        component={ReferralsScreen}
        options={{title: 'Referidos'}}
      />
      <ReferralsStack.Screen
        name="MyReferralsScreen"
        component={MyReferralsScreen}
        options={{title: 'Mis Referidos'}}
      />
    </ReferralsStack.Navigator>
  );
};

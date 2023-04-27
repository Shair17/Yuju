import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/HomeScreen';
import {NotificationsScreen} from '../screens/NotificationsScreen';
import {ReferralsScreen} from '../screens/ReferralsScreen';
import {MyReferralsScreen} from '../screens/MyReferralsScreen';
import {RootTabsParams} from './Root';
import {useTheme} from 'react-native-magnus';
import {EditProfileScreen} from '../screens/EditProfileScreen';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';

export type HomeStackParams = {
  HomeScreen: undefined;
  NotificationsScreen: undefined;
  ReferralsScreen: undefined;
  MyReferralsScreen: undefined;
  EditProfileScreen: undefined;
};

export type HomeStackParamsValue = keyof HomeStackParams;

const HomeStack = createNativeStackNavigator<HomeStackParams>();

interface Props
  extends BottomTabScreenProps<RootTabsParams, 'HomeStackScreen'> {}

export const HomeStackScreen: React.FC<Props> = ({navigation, route}) => {
  const {theme} = useTheme();
  const inRide = useSocketStore(s => s.inRide);
  const inRidePending = useSocketStore(s => s.inRidePending);
  const isInRide = !!inRide;
  const isInRidePending = !!inRidePending;

  const shouldGoToRequestScreen = isInRide || isInRidePending;

  useEffect(() => {
    if (!shouldGoToRequestScreen) return;

    navigation.jumpTo('RequestStackScreen');
  }, [shouldGoToRequestScreen, navigation]);

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: theme.colors?.body,
        },
        animation: 'slide_from_right',
      }}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false, title: 'Inicio'}}
      />
      <HomeStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{title: 'Notificaciones', animation: 'fade_from_bottom'}}
      />
      <HomeStack.Screen
        name="ReferralsScreen"
        component={ReferralsScreen}
        options={{title: 'Referidos'}}
      />
      <HomeStack.Screen
        name="MyReferralsScreen"
        component={MyReferralsScreen}
        options={{title: 'Mis Referidos'}}
      />
      <HomeStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{title: 'Editar Perfil', animation: 'fade_from_bottom'}}
      />
    </HomeStack.Navigator>
  );
};

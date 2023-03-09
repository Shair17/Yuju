import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/HomeScreen';
import {NotificationsScreen} from '../screens/NotificationsScreen';
import {ReferralsScreen} from '../screens/ReferralsScreen';
import {MyReferralsScreen} from '../screens/MyReferralsScreen';
import {RootTabsParams} from './Root';
import {useTheme} from 'react-native-magnus';
import {EditProfileScreen} from '../screens/EditProfileScreen';

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

export const HomeStackScreen: React.FC<Props> = () => {
  const {theme} = useTheme();

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

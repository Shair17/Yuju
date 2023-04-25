import React from 'react';
import {useTheme} from 'react-native-magnus';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileScreen} from '../screens/ProfileScreen';
import {EditProfileScreen} from '../screens/EditProfileScreen';
import {EditVehicleScreen} from '../screens/EditVehicleScreen';

export type ProfileStackParams = {
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  EditVehicleScreen: undefined;
};

export type ProfileStackParamsValue = keyof ProfileStackParams;

const ProfileStack = createNativeStackNavigator<ProfileStackParams>();

export const ProfileStackScreen = () => {
  const {theme} = useTheme();

  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
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
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
        }}
      />
      <ProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          title: 'Editar Perfil',
        }}
      />
      <ProfileStack.Screen
        name="EditVehicleScreen"
        component={EditVehicleScreen}
        options={{
          title: 'Editar Mototaxi',
        }}
      />
    </ProfileStack.Navigator>
  );
};

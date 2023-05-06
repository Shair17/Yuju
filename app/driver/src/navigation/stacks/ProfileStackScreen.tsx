import React, {useEffect} from 'react';
import {useTheme} from 'react-native-magnus';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileScreen} from '../screens/ProfileScreen';
import {EditProfileScreen} from '../screens/EditProfileScreen';
import {EditVehicleScreen} from '../screens/EditVehicleScreen';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {DrawerScreenProps} from '@react-navigation/drawer/';
import {RootDrawerParams} from '../drawer/Root';
import {useLocation} from '@yuju/global-hooks/useLocation';

export type ProfileStackParams = {
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  EditVehicleScreen: undefined;
};

export type ProfileStackParamsValue = keyof ProfileStackParams;

const ProfileStack = createNativeStackNavigator<ProfileStackParams>();

interface Props
  extends DrawerScreenProps<RootDrawerParams, 'ProfileStackScreen'> {}

export const ProfileStackScreen: React.FC<Props> = ({navigation}) => {
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

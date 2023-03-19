import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from 'react-native-magnus';
import {ProfileScreen} from '../screens/ProfileScreen';
import {AskHelpScreen} from '../screens/AskHelpScreen';
import {ReportBugScreen} from '../screens/ReportBugScreen';
import {HelpCenterScreen} from '../screens/HelpCenterScreen';
import {AddressesBookmarkScreen} from '../screens/AddressesBookmarkScreen';
import {DriversBookmarkScreen} from '../screens/DriversBookmarkScreen';
import {ReportsActivityScreen} from '../screens/ReportsActivityScreen';
import {EditProfileScreen} from '../screens/EditProfileScreen';
import {NotificationsScreen} from '../screens/NotificationsScreen';
// import {LanguageScreen} from '../screens/LanguageScreen';
import {ThemeScreen} from '../screens/ThemeScreen';
import {TripsActivityScreen} from '../screens/TripsActivityScreen';
import {MyReferralsScreen} from '../screens/MyReferralsScreen';
import {ReferralsScreen} from '../screens/ReferralsScreen';
import {MeetYourDriverScreen} from '../screens/MeetYourDriverScreen';

export type ProfileStackParams = {
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  NotificationsScreen: undefined;
  LanguageScreen: undefined;
  ReferralsScreen: undefined;
  MyReferralsScreen: undefined;
  ThemeScreen: undefined;
  TripsActivityScreen: undefined;
  MeetYourDriverScreen: {
    id: string;
  };
  ReportsActivityScreen: undefined;
  DriversBookmarkScreen: undefined;
  AddressesBookmarkScreen: undefined;
  HelpCenterScreen: undefined;
  ReportBugScreen: undefined;
  AskHelpScreen: undefined;
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
      }}>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          animation: 'fade_from_bottom',
          title: 'Editar Perfil',
        }}
      />
      <ProfileStack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{
          title: 'Notificaciones',
        }}
      />
      {/* <ProfileStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{
          title: 'Idioma',
        }}
      /> */}
      <ProfileStack.Screen
        name="ReferralsScreen"
        component={ReferralsScreen}
        options={{
          title: 'Mis Referidos',
        }}
      />
      <ProfileStack.Screen
        name="MyReferralsScreen"
        component={MyReferralsScreen}
        options={{
          title: 'Mis Referidos',
        }}
      />
      <ProfileStack.Screen
        name="ThemeScreen"
        component={ThemeScreen}
        options={{
          title: 'Tema',
        }}
      />
      <ProfileStack.Screen
        name="TripsActivityScreen"
        component={TripsActivityScreen}
        options={{
          title: 'Mis Viajes',
        }}
      />
      <ProfileStack.Screen
        name="MeetYourDriverScreen"
        component={MeetYourDriverScreen}
        options={{
          title: 'Conoce a tu Mototaxista',
        }}
      />
      <ProfileStack.Screen
        name="ReportsActivityScreen"
        component={ReportsActivityScreen}
        options={{
          title: 'Mis Reportes',
        }}
      />
      <ProfileStack.Screen
        name="DriversBookmarkScreen"
        component={DriversBookmarkScreen}
        options={{
          title: 'Mis Mototaxistas',
        }}
      />
      <ProfileStack.Screen
        name="AddressesBookmarkScreen"
        component={AddressesBookmarkScreen}
        options={{
          title: 'Mis Direcciones',
        }}
      />
      <ProfileStack.Screen
        name="HelpCenterScreen"
        component={HelpCenterScreen}
        options={{
          title: 'Centro de Ayuda',
        }}
      />
      <ProfileStack.Screen
        name="ReportBugScreen"
        component={ReportBugScreen}
        options={{
          title: 'Reportar un Error',
        }}
      />
      <ProfileStack.Screen
        name="AskHelpScreen"
        component={AskHelpScreen}
        options={{
          title: 'Solicitar Ayuda',
        }}
      />
    </ProfileStack.Navigator>
  );
};

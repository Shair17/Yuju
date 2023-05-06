import React, {useCallback, useEffect} from 'react';
import {useTheme, Icon} from 'react-native-magnus';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';
import {HomeStackScreen} from '../stacks/HomeStackScreen';
import {MyRatingsScreen} from '../screens/MyRatingsScreen';
import {MyTripsScreen} from '../screens/MyTripsScreen';
import {ProfileStackScreen} from '../stacks/ProfileStackScreen';
import {CustomDrawer} from './CustomDrawer';
import {ReferralsStackScreen} from '../stacks/ReferralsStackScreen';
import {HelpCenterScreen} from '../screens/HelpCenterScreen';
import {AskHelpScreen} from '../screens/AskHelpScreen';
import {ReportBugScreen} from '../screens/ReportBugScreen';
import {ReportsActivityScreen} from '../screens/ReportsActivityScreen';
import {useIsActive} from '@yuju/global-hooks/useIsActive';
import {Vibration} from 'react-native';
import {showAlert} from '@yuju/common/utils/notification';
import {useFocusEffect} from '@react-navigation/native';
import {MyEarningsScreen} from '../screens/MyEarningsScreen';
import {useLocation} from '@yuju/global-hooks/useLocation';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';

export type RootDrawerParams = {
  HomeStackScreen: undefined;
  MyEarningsScreen: undefined;
  MyRatingsScreen: undefined;
  MyTripsScreen: undefined;
  ReferralsStackScreen: undefined;
  ProfileStackScreen: undefined;
  HelpCenterScreen: undefined;
  ReportsActivityScreen: undefined;
  ReportBugScreen: undefined;
  AskHelpScreen: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParams>();

interface Props
  extends NativeStackScreenProps<RootStackParams, 'Application'> {}

export const Root: React.FC<Props> = ({navigation}) => {
  const {theme} = useTheme();
  const {isActive} = useIsActive();
  const {userLocation} = useLocation();
  const socket = useSocketStore(s => s.socket);
  // const inRide = useSocketStore(s => s.inRide);
  // const inRidePending = useSocketStore(s => s.inRidePending);
  // const isInRide = !!inRide;
  // const isInRidePending = !!inRidePending;
  // const shouldGoToRequestScreen = isInRide || isInRidePending;

  useFocusEffect(
    useCallback(() => {
      if (isActive) return;

      const timeoutId = setTimeout(() => {
        showAlert({
          title: 'Yuju',
          description:
            'Tu cuenta aún no ha sido activada, envía tus datos para activarla. Presiona en este mensaje para más información.',
          alertType: 'warn',
          duration: 8000,
          onShown() {
            Vibration.vibrate(1000);
          },
          onPress() {
            Vibration.vibrate(50);

            // @ts-ignore
            navigation.navigate('Application', {
              screen: 'ProfileStackScreen',
              params: {
                screen: 'ProfileScreen',
              },
            });
          },
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }, [navigation, isActive]),
  );

  useEffect(() => {
    socket?.emit('DRIVER_LOCATION', userLocation);

    return () => {
      socket?.off('DRIVER_LOCATION');
    };
  }, [socket, userLocation]);

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawer}
      initialRouteName="HomeStackScreen"
      backBehavior="history"
      screenOptions={{
        sceneContainerStyle: {
          backgroundColor: theme.colors?.body,
        },
        drawerStatusBarAnimation: 'fade',
        drawerType: 'slide',
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveBackgroundColor: '#3366FF',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#000',
        drawerItemStyle: {
          borderRadius: 8,
        },
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
        },
      }}>
      <Drawer.Screen
        name="HomeStackScreen"
        component={HomeStackScreen}
        options={{
          title: 'Inicio',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'home' : 'home-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="MyEarningsScreen"
        component={MyEarningsScreen}
        options={{
          title: 'Ganancias',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'cash' : 'cash-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="MyRatingsScreen"
        component={MyRatingsScreen}
        options={{
          title: 'Calificaciones',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'document-text' : 'document-text-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="MyTripsScreen"
        component={MyTripsScreen}
        options={{
          title: 'Carreras',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'archive' : 'archive-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="ReportsActivityScreen"
        component={ReportsActivityScreen}
        options={{
          title: 'Mis Reportes',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'albums' : 'albums-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="ReferralsStackScreen"
        component={ReferralsStackScreen}
        options={{
          title: 'Referidos',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'people' : 'people-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="ProfileStackScreen"
        component={ProfileStackScreen}
        options={{
          title: 'Perfil',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'person' : 'person-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="HelpCenterScreen"
        component={HelpCenterScreen}
        options={{
          title: 'Centro de Ayuda',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'documents' : 'documents-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="ReportBugScreen"
        component={ReportBugScreen}
        options={{
          title: 'Reportar Problemas',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'alert-circle' : 'alert-circle-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="AskHelpScreen"
        component={AskHelpScreen}
        options={{
          title: 'Solicitar Ayuda',
          drawerIcon({color, focused, size}) {
            return (
              <Icon
                ml="sm"
                fontFamily="Ionicons"
                name={focused ? 'help-circle' : 'help-circle-outline'}
                color={color}
                fontSize={size}
              />
            );
          },
        }}
      />
    </Drawer.Navigator>
  );
};

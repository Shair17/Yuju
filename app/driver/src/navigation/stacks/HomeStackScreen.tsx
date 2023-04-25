import React from 'react';
import {useTheme} from 'react-native-magnus';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {RootDrawerParams} from '../drawer/Root';
import {HomeScreen} from '../screens/HomeScreen';
import {TripDetailsScreen} from '../screens/TripDetailsScreen';
import {TripScreen} from '../screens/TripScreen';

export type HomeStackParams = {
  HomeScreen: undefined;
  TripDetailsScreen: {
    id: string;
    isNearPassenger?: boolean
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

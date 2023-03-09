import React from 'react';
import {Icon} from 'react-native-magnus';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import {HomeStackScreen} from './HomeStackScreen';
import {RequestStackScreen} from '../bottom-tabs/RequestStackScreen';
import {ProfileStackScreen} from '../bottom-tabs/ProfileStackScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';

export type RootTabsParams = {
  HomeStackScreen: undefined;
  RequestStackScreen: undefined;
  ProfileStackScreen: undefined;
};

const Tab = createBottomTabNavigator<RootTabsParams>();

interface Props
  extends NativeStackScreenProps<RootStackParams, 'Application'> {}

export const Root: React.FC<Props> = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStackScreen"
      backBehavior="history"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="HomeStackScreen"
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <Animatable.View
              animation="zoomIn"
              easing="ease-in-out"
              duration={400}>
              <Icon
                name={focused ? 'home' : 'home-outline'}
                fontFamily="Ionicons"
                color={color}
                fontSize={26}
              />
            </Animatable.View>
          ),
        }}
      />
      <Tab.Screen
        name="RequestStackScreen"
        component={RequestStackScreen}
        options={{
          headerShown: false,
          // tabBarBadge: 9,
          tabBarIcon: ({color, focused}) => (
            <Animatable.View
              animation="zoomIn"
              easing="ease-in-out"
              duration={450}>
              <Icon
                name={focused ? 'compass' : 'compass-outline'}
                fontFamily="Ionicons"
                color={color}
                fontSize={26}
              />
            </Animatable.View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStackScreen"
        component={ProfileStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <Animatable.View
              animation="zoomIn"
              easing="ease-in-out"
              duration={500}>
              <Icon
                name={focused ? 'person' : 'person-outline'}
                fontFamily="Ionicons"
                color={color}
                fontSize={26}
              />
            </Animatable.View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

import React from 'react';
import {Icon, Avatar, Skeleton, Div} from 'react-native-magnus';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import {HomeStackScreen} from './HomeStackScreen';
import {RequestStackScreen} from '../bottom-tabs/RequestStackScreen';
import {ProfileStackScreen} from '../bottom-tabs/ProfileStackScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';

export type RootTabsParams = {
  HomeStackScreen: undefined;
  RequestStackScreen: undefined;
  ProfileStackScreen: undefined;
};

const Tab = createBottomTabNavigator<RootTabsParams>();

interface Props
  extends NativeStackScreenProps<RootStackParams, 'Application'> {}

export const Root: React.FC<Props> = () => {
  const {
    data: myProfile,
    isLoading,
    isValidating,
  } = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });

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
              {isLoading || isValidating ? (
                <Skeleton.Circle w={26} h={26} bg="gray100" />
              ) : (
                <Avatar
                  rounded="circle"
                  size={focused ? 24 : 26}
                  borderWidth={focused ? 15 : 0}
                  bg="gray300"
                  borderColor={focused ? '#000' : 'transparent'}
                  source={{uri: myProfile?.user.profile.avatar}}
                />
              )}
            </Animatable.View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

{
  /* <Icon
                  name={focused ? 'person' : 'person-outline'}
                  fontFamily="Ionicons"
                  color={color}
                  fontSize={26}
                /> */
}

import React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Icon, Avatar, Skeleton, Div} from 'react-native-magnus';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import {HomeStackScreen} from './HomeStackScreen';
import {RequestStackScreen} from './RequestStackScreen';
import {ProfileStackScreen} from './ProfileStackScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {showAlert, showNotification} from '@yuju/common/utils/notification';

export type RootTabsParams = {
  HomeStackScreen: undefined;
  RequestStackScreen: undefined;
  ProfileStackScreen: undefined;
};

const Tab = createBottomTabNavigator<RootTabsParams>();

interface Props
  extends NativeStackScreenProps<RootStackParams, 'Application'> {}

export const Root: React.FC<Props> = () => {
  const {data: myProfile, isLoading} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });
  const inRide = useSocketStore(s => s.inRide);
  const inRidePending = useSocketStore(s => s.inRidePending);
  const isInRide = !!inRide;
  const isInRidePending = !!inRidePending;

  const shouldGoToRequestScreen = isInRide || isInRidePending;

  return (
    <Tab.Navigator
      initialRouteName={
        shouldGoToRequestScreen ? 'RequestStackScreen' : 'HomeStackScreen'
      }
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
                opacity={shouldGoToRequestScreen ? 0.25 : 1}
                name={focused ? 'home' : 'home-outline'}
                fontFamily="Ionicons"
                color={color}
                fontSize={26}
              />
            </Animatable.View>
          ),
        }}
        listeners={{
          tabPress: event => {
            if (shouldGoToRequestScreen) {
              event.preventDefault();

              showNotification({
                title: 'Yuju',
                description: 'No puedes navegar mientras está en una carrera.',
                duration: 1000,
              });
            }
          },
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
              {isLoading ? (
                <Skeleton.Circle w={26} h={26} bg="gray100" />
              ) : (
                <Avatar
                  opacity={shouldGoToRequestScreen ? 0.25 : 1}
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
        listeners={{
          tabPress: event => {
            if (shouldGoToRequestScreen) {
              event.preventDefault();

              showNotification({
                title: 'Yuju',
                description: 'No puedes navegar mientras está en una carrera.',
                duration: 1000,
              });
            }
          },
        }}
      />
    </Tab.Navigator>
  );
};

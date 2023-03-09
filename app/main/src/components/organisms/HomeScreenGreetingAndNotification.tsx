import React, {useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {Avatar, Badge, Div, Icon, Text} from 'react-native-magnus';
import * as Animatable from 'react-native-animatable';
import {useGreeting} from '@yuju/global-hooks/useGreeting';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';

interface Props {
  goToNotificationsScreen: () => void;
  goToEditProfileScreen: () => void;
}

export const HomeScreenGreetingAndNotification: React.FC<Props> = ({
  goToNotificationsScreen,
  goToEditProfileScreen,
}) => {
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });
  const animatableRef = useRef<Animatable.View>(null);
  const greeting = useGreeting();

  return (
    <Div row justifyContent="space-between">
      <Div>
        <TouchableOpacity activeOpacity={0.8} onPress={goToEditProfileScreen}>
          <Avatar
            source={{uri: myProfile?.user.profile.avatar}}
            rounded="circle"
            bg="gray100"
          />
        </TouchableOpacity>
        <Text fontSize="6xl" fontWeight="300">
          {greeting},
        </Text>
        <Text fontSize="4xl" fontWeight="700" numberOfLines={1}>
          {myProfile?.user.profile.name}
        </Text>
      </Div>

      <Div justifyContent="flex-start">
        <TouchableOpacity onPress={goToNotificationsScreen} activeOpacity={0.8}>
          <Animatable.View
            // @ts-ignore
            ref={animatableRef}
            animation="zoomIn"
            easing="ease-in-out"
            onAnimationEnd={() => {
              animatableRef.current?.swing!();
            }}>
            <Badge bg="red500" w={12} h={12}>
              <Icon
                fontFamily="Ionicons"
                name="notifications-outline"
                color="#000"
                fontSize="6xl"
              />
            </Badge>
          </Animatable.View>
        </TouchableOpacity>
      </Div>
    </Div>
  );
};

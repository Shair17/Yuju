import React, {useRef} from 'react';
import {TouchableOpacity, Vibration} from 'react-native';
import {
  Avatar,
  Div,
  Image,
  Text,
  Icon,
  Tooltip,
  TooltipRef,
} from 'react-native-magnus';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';
import {useIsActive} from '@yuju/global-hooks/useIsActive';
import * as Animatable from 'react-native-animatable';
import {formatDate} from '@yuju/common/utils/format';
import {getAgeFromDate} from '@yuju/common/utils/age';
import {showAlert} from '@yuju/common/utils/notification';

interface Props {
  onAccountInactivePress: () => void;
}

export const DrawerHeaderContent: React.FC<Props> = ({
  onAccountInactivePress,
}) => {
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/drivers/me',
  });
  const tooltipRef = useRef<TooltipRef>(null);
  const {isActive} = useIsActive();

  const showBadgeNotificationMessage = () => {
    if (!isActive) {
      Vibration.vibrate(100);
    }

    showAlert({
      title: 'Yuju',
      description: isActive
        ? 'Felicidades, oficialmente eres parte de Yuju!'
        : 'Tu cuenta aún no ha sido activada, envía tus datos para activarla. Presiona en este mensaje para más información.',
      alertType: isActive ? 'success' : 'warn',
      duration: isActive ? 1000 : 8000,
      onPress() {
        if (isActive) return;

        Vibration.vibrate(50);

        onAccountInactivePress();
      },
    });
  };

  return (
    <Div>
      <Div
        borderWidth={2}
        borderColor="gray100"
        w={105}
        h={105}
        rounded="circle"
        alignItems="center"
        justifyContent="center"
        position="relative">
        <Avatar
          size={100}
          source={{uri: myProfile?.driver.profile.avatar}}
          rounded="circle"
          bg="gray100"
          alignSelf="center"
        />
        {!isActive ? (
          <Div zIndex={10} position="absolute" bottom={0} right={0}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={showBadgeNotificationMessage}>
              <Animatable.View
                iterationCount="infinite"
                animation="pulse"
                easing="ease-in-out">
                <Image
                  alignSelf="center"
                  w={30}
                  h={30}
                  source={require('@yuju/assets/images/icons8-error-96.png')}
                />
              </Animatable.View>
            </TouchableOpacity>
          </Div>
        ) : null}
      </Div>

      <Div row alignItems="center">
        <Text fontWeight="bold" fontSize="2xl" numberOfLines={1}>
          {myProfile?.driver.profile.name}
        </Text>

        {isActive ? (
          <Tooltip
            ref={tooltipRef}
            text="Felicidades, oficialmente eres parte de Yuju!"
            fontWeight="500">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                tooltipRef.current?.show();
              }}>
              <Animatable.View
                iterationCount="infinite"
                animation="pulse"
                easing="ease-in-out">
                <Image
                  alignSelf="center"
                  ml="xs"
                  w={20}
                  h={20}
                  source={require('@yuju/assets/images/verification-badge-96.png')}
                />
              </Animatable.View>
            </TouchableOpacity>
          </Tooltip>
        ) : null}
      </Div>
      <Text mt="xs" fontSize="xs" color="gray400" numberOfLines={1}>
        {myProfile?.driver.profile.email}
      </Text>
      <Div row alignItems="center" mt="sm">
        <Div row mr="3xl">
          <Icon
            mr="xs"
            fontSize={10}
            fontFamily="Ionicons"
            name="phone-portrait-outline"
          />
          <Text fontSize={10}>{myProfile?.driver.profile.phoneNumber}</Text>
        </Div>
        <Div row>
          <Icon
            mr="xs"
            fontSize={10}
            fontFamily="MaterialCommunityIcons"
            name="cake"
          />
          <Text fontSize={10}>
            {getAgeFromDate(new Date(myProfile?.driver.profile.birthDate!))}{' '}
            años
          </Text>
        </Div>
      </Div>
      <Div row mt="sm">
        <Icon mr="xs" fontSize={10} fontFamily="Ionicons" name="time-outline" />

        <Text fontSize={10}>
          Te uniste{' '}
          <Text fontSize={10} color="gray500" fontWeight="600">
            {formatDate(new Date(myProfile?.driver.createdAt!))}
          </Text>
          .
        </Text>
      </Div>
    </Div>
  );
};

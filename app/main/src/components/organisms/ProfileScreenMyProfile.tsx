import React from 'react';
import {TouchableNativeFeedback} from 'react-native';
import {Div, Text, Avatar, Image, Icon, Skeleton} from 'react-native-magnus';
import * as Animatable from 'react-native-animatable';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';

interface Props {
  goToEditProfileScreen: () => void;
}

export const ProfileScreenMyProfile: React.FC<Props> = ({
  goToEditProfileScreen,
}) => {
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });

  return (
    <Div rounded="lg" mb="lg" overflow="hidden" flex={1}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#d4d4d8', true)}
        onPress={goToEditProfileScreen}>
        <Div
          row
          rounded="lg"
          p="xl"
          borderWidth={1}
          borderColor="gray200"
          // shadow="xs"
          // bg="#fff"
          alignItems="center"
          justifyContent="space-between">
          <Div row>
            {!myProfile ? (
              <Skeleton.Circle w={48} h={48} bg="gray100" />
            ) : (
              <Avatar
                source={{uri: myProfile?.user.profile.avatar}}
                rounded="circle"
                bg="gray100"
              />
            )}
            <Div ml="md">
              <Div row alignItems="center">
                {!myProfile ? (
                  <Skeleton rounded="lg" bg="gray100" w={140} h={20} />
                ) : (
                  <Text fontSize="xl" fontWeight="bold" numberOfLines={1}>
                    {myProfile?.user.profile.name}
                  </Text>
                )}

                {myProfile?.user.isAdmin ? (
                  <Animatable.View animation="zoomIn" easing="ease-in-out">
                    <Image
                      alignSelf="center"
                      ml="xs"
                      w={20}
                      h={20}
                      source={require('@yuju/assets/images/verification-badge-96.png')}
                    />
                  </Animatable.View>
                ) : null}
              </Div>

              {!myProfile ? (
                <Skeleton rounded="lg" mt="sm" bg="gray100" w={100} h={15} />
              ) : (
                <Text numberOfLines={1} color="gray500">
                  {myProfile?.user.profile.email}
                </Text>
              )}
            </Div>
          </Div>
          <Div>
            <Icon
              fontSize="5xl"
              fontFamily="Ionicons"
              name="chevron-forward"
              color="gray500"
            />
          </Div>
        </Div>
      </TouchableNativeFeedback>
    </Div>
  );
};

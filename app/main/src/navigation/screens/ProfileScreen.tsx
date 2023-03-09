import React from 'react';
import {TouchableNativeFeedback, StatusBar} from 'react-native';
import {Div, Text, Avatar, Image, Button, Icon} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as Animatable from 'react-native-animatable';
import {
  ProfileStackParams,
  ProfileStackParamsValue,
} from '../bottom-tabs/ProfileStackScreen';
import {ProfileSettingItem} from '@yuju/components/molecules/ProfileSettingItem';
import {ProfileSettingTitle} from '@yuju/components/atoms/ProfileSettingTitle';
import {useAppVersion} from '@yuju/global-hooks/useAppVersion';
import {Separator} from '@yuju/components/atoms/Separator';
import {LogoutButton} from '@yuju/components/atoms/LogoutButton';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'ProfileScreen'> {}

export const ProfileScreen: React.FC<Props> = ({navigation}) => {
  const appVersion = useAppVersion();
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });

  const navigateTo = (screen: ProfileStackParamsValue) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollScreen>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <Div rounded="lg" mb="lg" overflow="hidden" flex={1}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('#d4d4d8', true)}
            onPress={() => navigateTo('EditProfileScreen')}>
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
                <Avatar
                  source={{uri: myProfile?.user.profile.avatar}}
                  rounded="circle"
                  bg="gray100"
                />
                <Div ml="md">
                  <Div row alignItems="center">
                    <Text fontSize="xl" fontWeight="bold" numberOfLines={1}>
                      {myProfile?.user.profile.name}
                    </Text>

                    <Animatable.View animation="zoomIn" easing="ease-in-out">
                      <Image
                        alignSelf="center"
                        ml="xs"
                        w={20}
                        h={20}
                        source={require('@yuju/assets/images/verification-badge-96.png')}
                      />
                    </Animatable.View>

                    {/* <Tag
                        alignSelf="center"
                        ps="sm"
                        pb="xs"
                        pl="sm"
                        pr="sm"
                        pt="xs"
                        ml="md"
                        fontSize={8}
                        rounded="lg"
                        bg="primary100"
                        fontWeight="500"
                        color="primary900">
                        Gratis
                      </Tag> */}
                  </Div>

                  <Text numberOfLines={1} color="gray500">
                    {myProfile?.user.profile.email}
                  </Text>
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

        <Div mb="lg">
          <ProfileSettingTitle title="Anuncio" />

          <Div
            rounded="lg"
            px="xl"
            py="lg"
            borderWidth={1}
            borderColor="gray200"
            // shadow="xs"
            // bg="#fff"
            alignItems="center"
            justifyContent="space-between"
            mt="md"
            overflow="hidden"
            flex={1}
            row>
            <Div flex={2}>
              <Image
                flex={1}
                source={require('@yuju/assets/images/rocket.png')}
                resizeMode="contain"
              />
            </Div>
            <Div flex={3}>
              <Text mb="sm" fontSize="xl" fontWeight="bold" color="gray500">
                Yuju Pro 😎
              </Text>

              <Text mb="sm" color="gray500">
                Go Pro and unlock all the benefits and assets!
              </Text>

              <Button rounded="lg" block fontWeight="bold">
                Subir a Premium
              </Button>
            </Div>
          </Div>
        </Div>

        <Div mb="lg">
          <ProfileSettingTitle title="Configuraciones y Preferencias" />

          <ProfileSettingItem
            onPress={() => navigateTo('NotificationsScreen')}
            iconName="notifications"
            title="Notificaciones"
          />
          <ProfileSettingItem
            onPress={() => navigateTo('MyReferralsScreen')}
            iconName="happy"
            title="Referidos"
          />
          <ProfileSettingItem
            onPress={() => navigateTo('ThemeScreen')}
            iconName="color-palette"
            title="Tema"
          />
        </Div>

        <Separator />

        <Div mb="lg">
          <ProfileSettingTitle title="Actividad" />

          <ProfileSettingItem
            onPress={() => navigateTo('TripsActivityScreen')}
            iconName="navigate"
            title="Viajes"
          />
          <ProfileSettingItem
            onPress={() => navigateTo('ReportsActivityScreen')}
            iconName="archive"
            title="Reportes"
          />
        </Div>

        <Separator />

        <Div mb="lg">
          <ProfileSettingTitle title="Marcadores" />

          <ProfileSettingItem
            onPress={() => navigateTo('DriversBookmarkScreen')}
            iconName="people"
            title="Mototaxistas"
          />
          <ProfileSettingItem
            onPress={() => navigateTo('AddressesBookmarkScreen')}
            iconName="location"
            title="Direcciones"
          />
        </Div>

        <Separator />

        <Div mb="lg">
          <ProfileSettingTitle title="Soporte" />

          <ProfileSettingItem
            onPress={() => navigateTo('HelpCenterScreen')}
            iconName="documents"
            title="Centro de Ayuda"
          />
          <ProfileSettingItem
            onPress={() => navigateTo('ReportBugScreen')}
            iconName="bug"
            title="Reportar un error"
          />
          <ProfileSettingItem
            onPress={() => navigateTo('AskHelpScreen')}
            iconName="help-circle"
            title="Solicitar Ayuda"
          />
        </Div>

        <Separator />

        <Div mb="lg">
          <ProfileSettingTitle title="Sesión" />

          <Div flex={1} mt="md" rounded={8} overflow="hidden">
            <LogoutButton />
          </Div>
        </Div>

        <Div mt="2xl">
          <Text textAlign="center" fontSize={8} color="gray500">
            Yuju v{appVersion} • Por Shair
          </Text>
        </Div>
      </Div>
    </ScrollScreen>
  );
};

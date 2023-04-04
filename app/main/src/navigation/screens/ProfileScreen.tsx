import React from 'react';
import {StatusBar} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ProfileStackParams,
  ProfileStackParamsValue,
} from '../bottom-tabs/ProfileStackScreen';
import {ProfileSettingItem} from '@yuju/components/molecules/ProfileSettingItem';
import {ProfileSettingTitle} from '@yuju/components/atoms/ProfileSettingTitle';
import {useAppVersion} from '@yuju/global-hooks/useAppVersion';
import {Separator} from '@yuju/components/atoms/Separator';
import {LogoutButton} from '@yuju/components/atoms/LogoutButton';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {ProfileScreenMyProfile} from '@yuju/components/organisms/ProfileScreenMyProfile';
import {ProfileScreenAdBanner} from '@yuju/components/organisms/ProfileScreenAdBanner';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'ProfileScreen'> {}

export const ProfileScreen: React.FC<Props> = ({navigation}) => {
  const appVersion = useAppVersion();

  const navigateTo = (screen: ProfileStackParamsValue, params?: any) => {
    navigation.navigate(screen, params);
  };

  return (
    <ScrollScreen>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <ProfileScreenMyProfile
          goToEditProfileScreen={() => navigateTo('EditProfileScreen')}
        />

        <ProfileScreenAdBanner />

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
            iconName="alert-circle"
            title="Reportar un Problema"
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

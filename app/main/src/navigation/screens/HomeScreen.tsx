import React from 'react';
import {StatusBar} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Div} from 'react-native-magnus';
import {HomeScreenGreetingAndNotification} from '@yuju/components/organisms/HomeScreenGreetingAndNotification';
import {HomeScreenCurrentLocation} from '@yuju/components/organisms/HomeScreenCurrentLocation';
import {HomeScreenInviteFriends} from '@yuju/components/organisms/HomeScreenInviteFriends';
import {HomeScreenAskDriver} from '@yuju/components/organisms/HomeScreenAskDriver';
import {HomeScreenRecommended} from '@yuju/components/organisms/HomeScreenRecommended';
import {HomeScreenWhereToGo} from '@yuju/components/organisms/HomeScreenWhereToGo';
import {HomeScreenLatestTrips} from '@yuju/components/organisms/HomeScreenLatestTrips';
import {HomeScreenCopyright} from '@yuju/components/organisms/HomeScreenCopyright';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {
  HomeStackParams,
  HomeStackParamsValue,
} from '../bottom-tabs/HomeStackScreen';

/**
 * se puede llegar a un acuerdo con los negocios aquí en el valle jequetepeque
 * de tal forma que si un restaurante quiere tener más clientes entonces paga mensual
 * a la aplicación y en la app se verán reflejados esos anuncios promocionados que no son anuncios en realidad
 * si no, son recomendaciones
 *
 * ver esto https://cdn.dribbble.com/userupload/3926421/file/original-fbe19aec7db3980a6b39d04eaedb9977.png?compress=1&resize=752x
 * en la sección de find nearby
 */

interface Props extends NativeStackScreenProps<HomeStackParams, 'HomeScreen'> {}

export const HomeScreen: React.FC<Props> = ({navigation}) => {
  const navigateTo = (screen: HomeStackParamsValue) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollScreen>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        {/** Greeting and Notification Icon */}
        <HomeScreenGreetingAndNotification
          goToEditProfileScreen={() => navigateTo('EditProfileScreen')}
          goToNotificationsScreen={() => navigateTo('NotificationsScreen')}
        />

        {/** Current Location */}
        <HomeScreenCurrentLocation />

        {/** Invite Friends */}
        <HomeScreenInviteFriends
          goToReferralsScreen={() => navigateTo('ReferralsScreen')}
        />

        {/** Ask Driver */}
        <HomeScreenAskDriver
          goToRequestScreen={() =>
            navigation.navigate('RequestStackScreen' as any, {
              screen: 'RequestScreen',
            })
          }
        />

        {/** Recommend */}
        <HomeScreenRecommended />

        {/** Where to go? */}
        <HomeScreenWhereToGo />

        {/** Where to go? */}
        <HomeScreenLatestTrips />

        {/** Copyright */}
        <HomeScreenCopyright />
      </Div>
    </ScrollScreen>
  );
};

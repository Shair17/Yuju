import React from 'react';
import {StatusBar} from 'react-native';
import {Div, Image, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {HomeStackParams} from '../bottom-tabs/HomeStackScreen';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetReferralsResponse} from '@yuju/types/app';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {MyReferralItem} from '@yuju/components/molecules/MyReferralItem';

const referralsNotFoundImagePlaceholder = require('@yuju/assets/images/oops-404-error.png');

interface Props
  extends NativeStackScreenProps<
    HomeStackParams | ProfileStackParams,
    'MyReferralsScreen'
  > {}

// En esta pantalla mostrar más datos sobre mis referidos
// datos como: fecha en la que se metieron como mis referidos
// su foto de perfil
// su nombre
// eso es todo, nada más

export const MyReferralsScreen: React.FC<Props> = ({navigation}) => {
  const {data: myReferrals} = useRequest<GetReferralsResponse>({
    method: 'GET',
    url: '/users/me/referrals',
  });
  const hasReferrals = myReferrals?.referrals.length !== 0;

  return (
    <ScrollScreen>
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <Div>
          <Text fontWeight="bold" color="text" fontSize="5xl">
            Tienes {myReferrals?.referrals.length.toString() ?? '0'} referidos
          </Text>
          <Text mt="md" fontSize="lg" color="gray700">
            Aquí podrás ver más información sobre tus referidos.
          </Text>
        </Div>

        {hasReferrals ? (
          <Div my="lg">
            {myReferrals?.referrals.map(({id, avatar, name}) => (
              <MyReferralItem key={id} avatar={avatar} id={id} name={name} />
            ))}
          </Div>
        ) : (
          <Div>
            <Image
              h={500}
              resizeMode="contain"
              source={referralsNotFoundImagePlaceholder}
            />
            <Text textAlign="center" fontSize="lg" color="gray500">
              Aún no tienes referidos.
            </Text>
          </Div>
        )}
      </Div>
    </ScrollScreen>
  );
};

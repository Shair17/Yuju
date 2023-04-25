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
import {LoadingTemplate} from '@yuju/components/templates/LoadingTemplate';

const referralsNotFoundImagePlaceholder = require('@yuju/assets/images/oops-404-error.png');

interface Props
  extends NativeStackScreenProps<
    HomeStackParams | ProfileStackParams,
    'MyReferralsScreen'
  > {}

export const MyReferralsScreen: React.FC<Props> = ({navigation}) => {
  const {isLoading, data: myReferrals} = useRequest<GetReferralsResponse>({
    method: 'GET',
    url: '/referrals/user',
  });
  const hasReferrals = myReferrals?.referrals.length !== 0;

  if (isLoading) {
    return <LoadingTemplate />;
  }

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

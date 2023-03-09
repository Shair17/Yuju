import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Div, Text, Icon, Button, Avatar, Image} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {HomeStackParams} from '../bottom-tabs/HomeStackScreen';
import {StatusBar} from 'react-native';
import {ReferrerItem} from '@yuju/components/molecules/ReferrerItem';
import {useShareMyReferralCode} from '@yuju/global-hooks/useShareMyReferralCode';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {SimpleGrid} from 'react-native-super-grid';

const referralsNotFoundImagePlaceholder = require('@yuju/assets/images/oops-404-error.png');

interface Props
  extends NativeStackScreenProps<
    HomeStackParams | ProfileStackParams,
    'ReferralsScreen'
  > {}

export const ReferralsScreen: React.FC<Props> = ({navigation}) => {
  const {
    isLoading,
    myReferrals,
    handleCopyMyReferralCodeToClipboard,
    handleShareMyReferralCode,
  } = useShareMyReferralCode();
  const hasReferredBy = !!myReferrals?.referredBy;
  const hasReferrals = myReferrals?.referrals.length !== 0;

  const goToMyReferralsScreen = () => {
    navigation.navigate('MyReferralsScreen');
  };

  return (
    <ScrollScreen>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        {/** My earning  */}
        <Div>
          <Text fontSize="2xl">
            Tu ganancia es de{' '}
            <Text fontSize="2xl" fontWeight="bold">
              S/. {myReferrals?.myEarnings ?? '-'}
            </Text>
          </Text>
        </Div>

        {/** Anuncio */}
        <Div rounded="lg" overflow="hidden" mt="lg">
          <Div p="xl" bg="secondary50" rounded="lg" row>
            <Text color="secondary900" fontSize="4xl" fontWeight="bold">
              Gana hasta{' '}
              <Text color="secondary900" fontSize="4xl" fontWeight="bold">
                S./{myReferrals?.earn ?? '-'}
              </Text>{' '}
              por invitar amigos
            </Text>
          </Div>
        </Div>

        {/** Share my code */}
        <Div mt="lg">
          <Div
            flex={1}
            rounded="lg"
            p="lg"
            borderWidth={1}
            borderColor="gray200"
            alignItems="center"
            row
            justifyContent="space-between">
            <Div flex={1}>
              <Text fontSize="xs" color="gray400">
                Tu código de invitación
              </Text>
              <Div row alignItems="center" mt={5}>
                <Text fontSize="lg" fontWeight="500">
                  {myReferrals?.code ?? 'XXX123'}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCopyMyReferralCodeToClipboard}>
                  <Icon ml="xs" fontFamily="Ionicons" name="copy" />
                </TouchableOpacity>
              </Div>
            </Div>

            <Div alignItems="center" justifyContent="center" alignSelf="center">
              <Button
                fontSize="md"
                rounded="circle"
                px="lg"
                py="sm"
                onPress={handleShareMyReferralCode}>
                Invitar
              </Button>
            </Div>
          </Div>
        </Div>

        {/** My invited list */}
        <Div mt="lg">
          <Div row alignItems="center" justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="500">
              Mis Referidos
            </Text>

            <Button
              alignSelf="center"
              bg="primary50"
              fontWeight="bold"
              rounded="lg"
              px="md"
              py="xs"
              fontSize={8}
              color="primary900"
              onPress={goToMyReferralsScreen}>
              Ver más
            </Button>
          </Div>

          {hasReferrals ? (
            <Div mt="md">
              <SimpleGrid
                data={myReferrals?.referrals!}
                spacing={0}
                renderItem={({item: {id, avatar, name}, index, separators}) => {
                  const isOdd = (index + 1) % 2 === 0;
                  const areFirstTwoItems = index + 1 === 1 || index + 1 === 2;

                  return (
                    <ReferrerItem
                      mt={!areFirstTwoItems ? 'xl' : undefined}
                      mr={!isOdd ? 'md' : undefined}
                      ml={isOdd ? 'md' : undefined}
                      key={id}
                      avatar={avatar}
                      cost={myReferrals!.earn / myReferrals!.maxReferrals}
                    />
                  );
                }}
              />
            </Div>
          ) : (
            <Div mt="xl">
              <Image
                h={200}
                resizeMode="contain"
                source={referralsNotFoundImagePlaceholder}
              />
              <Text textAlign="center" fontSize="lg" color="gray500">
                Aún no tienes referidos.
              </Text>
            </Div>
          )}
        </Div>

        {hasReferredBy ? (
          <Div mt="2xl">
            <Div row>
              <Avatar
                size={10}
                alignSelf="center"
                rounded="circle"
                bg="gray100"
                source={{
                  uri: myReferrals?.referredBy?.profile.avatar,
                }}
              />
              <Text ml={4} fontSize={10} color="gray400">
                <Text fontSize={10} color="gray400" fontWeight="500">
                  {myReferrals?.referredBy?.profile.name}
                </Text>{' '}
                te invitó a formar parte de{' '}
                <Text fontSize={10} color="gray400" fontWeight="700">
                  Yuju
                </Text>
                .
              </Text>
            </Div>
          </Div>
        ) : null}

        {/** Legal */}
        <Div mt="2xl">
          <Text textAlign="center" fontSize="sm" color="gray500">
            Al participar en las actividades que ofrecen recompensas, aceptas
            nuestros{' '}
            <Text color="gray500" fontWeight="500" fontSize="sm">
              Terminos y Condiciones
            </Text>
            .
          </Text>
        </Div>
      </Div>
    </ScrollScreen>
  );
};

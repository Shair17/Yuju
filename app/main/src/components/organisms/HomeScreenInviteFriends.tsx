import React from 'react';
import {TouchableNativeFeedback, TouchableOpacity} from 'react-native';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import {useShareMyReferralCode} from '@yuju/global-hooks/useShareMyReferralCode';

interface Props {
  goToReferralsScreen: () => void;
}

export const HomeScreenInviteFriends: React.FC<Props> = ({
  goToReferralsScreen,
}) => {
  const {
    myReferrals,
    handleCopyMyReferralCodeToClipboard,
    handleShareMyReferralCode,
  } = useShareMyReferralCode();

  return (
    <Div mt="lg">
      <Div rounded="lg" overflow="hidden">
        <TouchableNativeFeedback
          onPress={goToReferralsScreen}
          background={TouchableNativeFeedback.Ripple('#B2EE96', true)}>
          <Div
            p="xl"
            bg="secondary50"
            rounded="lg"
            row
            justifyContent="space-between">
            <Div flex={3}>
              <Text color="secondary900" fontSize="4xl" fontWeight="bold">
                Gana hasta{' '}
                <Text color="secondary900" fontSize="4xl" fontWeight="bold">
                  S./{myReferrals?.earn ?? '10'}
                </Text>{' '}
                por invitar amigos
              </Text>
              <Text fontSize={8} mt="sm" color="secondary500">
                Tú codigo es{' '}
                <Text fontSize={8} color="secondary500" fontWeight="500">
                  {myReferrals?.code ?? 'XXX123'}
                </Text>
              </Text>
            </Div>
            <Div alignItems="center" justifyContent="space-evenly" flex={1}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleShareMyReferralCode}>
                <Icon
                  fontFamily="Ionicons"
                  name="share-social"
                  color="secondary900"
                  fontSize="6xl"
                  alignSelf="center"
                  rounded="circle"
                />
              </TouchableOpacity>
              <Button
                mt="lg"
                borderWidth={1}
                borderColor="yellow500"
                bg="yellow50"
                fontWeight="bold"
                rounded="lg"
                prefix={
                  <Icon
                    color="yellow900"
                    name="copy"
                    fontFamily="Ionicons"
                    fontSize={8}
                    mr={2}
                  />
                }
                p="xs"
                fontSize={8}
                color="yellow900"
                onPress={handleCopyMyReferralCodeToClipboard}>
                Copiar código
              </Button>
            </Div>
          </Div>
        </TouchableNativeFeedback>
      </Div>
    </Div>
  );
};

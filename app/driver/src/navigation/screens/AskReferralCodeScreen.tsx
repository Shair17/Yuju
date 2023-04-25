import React from 'react';
import {StatusBar, TouchableOpacity} from 'react-native';
import {
  Div,
  Input,
  Text,
  Button,
  Image,
  Icon,
  Avatar,
} from 'react-native-magnus';
import {RNActivityIndicator} from '@yuju/components/atoms/RNActivityIndicator';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {ReferralCodeResponse} from '@yuju/types/app';
import {
  AskReferralCodeFormDataValues,
  askReferralCodeSchema,
} from '@yuju/common/schemas/ask-referral-code.schema';

const EMOJI_IMG = require('@yuju/assets/images/money-mouth-face.png');

interface Props
  extends NativeStackScreenProps<RootStackParams, 'AskReferralCodeScreen'> {}

export const AskReferralCodeScreen: React.FC<Props> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
    clearErrors,
    resetField,
  } = useForm<AskReferralCodeFormDataValues>({
    resolver: zodResolver(askReferralCodeSchema),
  });
  const referralCode = watch('referralCode');
  const canMakeRequest = !!referralCode && referralCode.length === 6;
  const {
    data: referralCodeResponse,
    isLoading,
    isError,
    error,
  } = useRequest<ReferralCodeResponse>(
    canMakeRequest
      ? {
          method: 'GET',
          url: `/referrals/driver/${referralCode}`,
        }
      : null,
  );
  const referralCodeNotFound =
    isError &&
    // @ts-ignore
    error?.response?.data?.message === 'DRIVER_FROM_REFERRAL_CODE_NOT_FOUND';
  const cantUseOwnCodeError =
    // @ts-ignore
    isError && error?.response?.data?.message === 'CANT_USE_OWN_CODE';

  const handleNext = handleSubmit(data => {
    navigation.navigate('AskAvatarScreen', {
      referralCode: !isError
        ? referralCodeResponse?.referralCode || data.referralCode
        : undefined,
    });
  });

  return (
    <ScrollScreen>
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <Div>
          <Div>
            <Image h={180} source={EMOJI_IMG} resizeMode="contain" />
            <Text fontWeight="700" textAlign="center" mt="md" fontSize="5xl">
              ¿Tienes un código de referencia?
            </Text>

            <Text mt="md" textAlign="center" fontSize="md">
              Si tu amigo te pasó un código para introducir en la aplicación, es
              ahora o nunca, inserta el código para validarlo.
            </Text>
          </Div>

          <Div my="xl" alignItems="center">
            <Controller
              control={control}
              rules={{
                required: false,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  suffix={
                    referralCode ? (
                      isLoading ? (
                        <RNActivityIndicator />
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            const canDeleteField =
                              isError || referralCode.length !== 6;

                            if (!canDeleteField) {
                              return;
                            }

                            clearErrors('referralCode');
                            resetField('referralCode');
                          }}
                          activeOpacity={0.8}>
                          <Icon
                            fontFamily="Ionicons"
                            name={
                              isError || referralCode.length !== 6
                                ? 'close-circle'
                                : 'checkmark-circle'
                            }
                            fontSize="xl"
                            alignSelf="center"
                            color={
                              isError || referralCode.length !== 6
                                ? 'red500'
                                : 'green500'
                            }
                          />
                        </TouchableOpacity>
                      )
                    ) : null
                  }
                  w="35%"
                  placeholder="Código"
                  autoCapitalize="characters"
                  maxLength={6}
                  fontSize="lg"
                  rounded="lg"
                  borderColor="gray300"
                  focusBorderColor="primary700"
                />
              )}
              name="referralCode"
            />
            {errors.referralCode ? (
              <Text color="red500" mt="md">
                El código debe contener 6 caracteres.
              </Text>
            ) : null}
            {referralCodeNotFound || cantUseOwnCodeError ? (
              <Text color="red500" mt="md">
                Prueba con otro código.
              </Text>
            ) : null}

            <Div mt="md">
              <Div row opacity={!referralCodeResponse || isError ? 0 : 1}>
                <Avatar
                  size={10}
                  alignSelf="center"
                  rounded="circle"
                  bg="gray100"
                  source={{
                    uri: referralCodeResponse?.driver.avatar,
                  }}
                />
                <Text ml={4} fontSize={10} color="gray400">
                  <Text fontSize={10} color="gray400" fontWeight="500">
                    {referralCodeResponse?.driver.name}
                  </Text>{' '}
                  te invitó a formar parte de{' '}
                  <Text fontSize={10} color="gray400" fontWeight="700">
                    Yuju
                  </Text>
                  .
                </Text>
              </Div>
            </Div>
          </Div>
        </Div>

        <Div mt="3xl">
          <Button
            block
            fontWeight="bold"
            rounded="lg"
            loading={isLoading}
            h={55}
            fontSize="3xl"
            onPress={handleNext}>
            {!!referralCode || !!referralCodeResponse ? 'Continuar' : 'Saltar'}
          </Button>
        </Div>
      </Div>
    </ScrollScreen>
  );
};

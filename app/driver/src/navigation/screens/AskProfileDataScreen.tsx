import React, {useMemo, useState} from 'react';
import {StatusBar} from 'react-native';
import {Div, Icon, Input, Text, Button} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {Controller} from 'react-hook-form';
import {RootStackParams} from '../Root';
import {getAgeFromDate} from '@yuju/common/utils/age';
import DatePicker from 'react-native-date-picker';
import {useEditProfile} from '@yuju/global-hooks/useEditProfile';
import {AskScreenHeadingTitle} from '@yuju/components/organisms/AskScreenHeadingTitle';
import {GetMyProfile} from '@yuju/types/app';
import {getRandomSummaryPlaceholder} from '@yuju/common/utils/random';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'AskProfileDataScreen'> {}

export const AskProfileDataScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: {avatar, referralCode},
  },
}) => {
  const {control, handleSubmit, formState} = useEditProfile();
  const {isLoading, isValidating} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/drivers/me',
  });
  const [showDateError, setDateError] = useState(false);
  const [date, setDate] = useState(new Date());
  const randomSummaryPlaceholder = useMemo(getRandomSummaryPlaceholder, []);

  const handleNext = handleSubmit(data => {
    const age = getAgeFromDate(date);

    if (age < 18) {
      setDateError(true);
      return;
    }

    setDateError(false);

    navigation.navigate('AskVehicleDataScreen', {
      avatar,
      referralCode,
      email: data.email,
      dni: data.dni,
      phoneNumber: data.phone,
      birthDate: String(date),
      summary: data.summary,
    });
  });

  return (
    <ScrollScreen>
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <AskScreenHeadingTitle
          title="Es momento de completar tu perfil"
          subtitle="Es importante agregar datos reales para brindarte un mejor servicio."
        />

        <Div my="lg" />

        <Div mt="md">
          {/** Email */}
          <Div>
            <Text fontWeight="500" color="gray500">
              Tu Correo Electrónico
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  autoFocus
                  mt="md"
                  placeholder="Correo electrónico"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  fontSize="lg"
                  rounded="lg"
                  focusBorderColor="primary700"
                  fontWeight="500"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  borderColor={formState.errors.email ? 'red' : 'gray400'}
                  prefix={<Icon name="mail" mr="xs" fontFamily="Ionicons" />}
                />
              )}
              name="email"
            />
            {formState.errors.email && (
              <Text color="red" mt={2} fontWeight="500">
                Correo electrónico es requerido, ejemplo: ejemplo@email.com.
              </Text>
            )}
          </Div>

          {/** DNI */}
          <Div mt="lg">
            <Text fontWeight="500" color="gray500">
              Tu Documento Nacional de Identidad
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  mt="md"
                  placeholder="Documento Nacional de Identidad"
                  keyboardType="numeric"
                  fontSize="lg"
                  maxLength={8}
                  prefix={<Icon fontFamily="Ionicons" name="card" mr="xs" />}
                  rounded="lg"
                  focusBorderColor="primary700"
                  fontWeight="500"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  borderColor={formState.errors.dni ? 'red' : 'gray400'}
                />
              )}
              name="dni"
            />
            {formState.errors.dni && (
              <Text color="red" mt={2} fontWeight="500">
                Documento Nacional de Identidad inválido.
              </Text>
            )}
          </Div>

          {/** Phone */}
          <Div mt="lg">
            <Text fontWeight="500" color="gray500">
              Tu Número de celular
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  mt="md"
                  fontWeight="500"
                  onBlur={onBlur}
                  maxLength={9}
                  onChangeText={onChange}
                  value={value}
                  borderColor={formState.errors.phone ? 'red' : 'gray400'}
                  placeholder="Número de Celular"
                  keyboardType="numeric"
                  fontSize="lg"
                  prefix={
                    <Icon fontFamily="Ionicons" name="phone-portrait" mr="xs" />
                  }
                  rounded="lg"
                  focusBorderColor="primary700"
                />
              )}
              name="phone"
            />
            {formState.errors.phone && (
              <Text color="red" mt={2} fontWeight="500">
                Número de celular inválido.
              </Text>
            )}
          </Div>

          {/** Summary */}
          <Div mt="lg">
            <Text fontWeight="500" color="gray500">
              Tu resumen
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Div position="relative">
                  <Input
                    mt="md"
                    placeholder={randomSummaryPlaceholder}
                    keyboardType="default"
                    numberOfLines={3}
                    multiline
                    textAlignVertical="top"
                    maxLength={100}
                    fontSize="lg"
                    rounded="lg"
                    focusBorderColor="primary700"
                    fontWeight="500"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    borderColor={formState.errors.summary ? 'red' : 'gray400'}
                  />
                  {value?.length > 0 ? (
                    <Div position="absolute" bottom={5} right={5} zIndex={1}>
                      <Text
                        fontSize="xs"
                        color={value.length >= 100 ? 'red' : 'gray500'}
                        fontWeight={value.length >= 100 ? '600' : '400'}>
                        {value.length}/100
                      </Text>
                    </Div>
                  ) : null}
                </Div>
              )}
              name="summary"
            />
            {formState.errors.summary ? (
              <Text color="red" mt={2} fontWeight="500">
                El resumen es requerido.
              </Text>
            ) : null}
          </Div>

          {/** BirthDate */}
          <Div mt="lg">
            <Text fontWeight="500" color="gray500">
              Fecha de Nacimiento
            </Text>

            <Div alignItems="center" mt="md">
              <DatePicker date={date} onDateChange={setDate} mode="date" />
              {showDateError && (
                <Text color="red" mt={2} fontWeight="500">
                  Tienes que ser mayor de edad para poder registrarte.
                </Text>
              )}
            </Div>
          </Div>
        </Div>

        <Div mt="2xl">
          <Button
            onPress={handleNext}
            block
            fontWeight="bold"
            rounded="lg"
            h={55}
            fontSize="3xl"
            loading={isLoading || isValidating}>
            Continuar
          </Button>
        </Div>
      </Div>
    </ScrollScreen>
  );
};

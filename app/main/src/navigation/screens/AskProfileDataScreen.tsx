import React, {useState} from 'react';
import {Div, Icon, Input, Text, Button} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {Controller} from 'react-hook-form';
import {RootStackParams} from '../Root';
import {StatusBar} from 'react-native';
import {
  CreateProfileBody,
  CreateProfileResponse,
  GetMyProfile,
} from '@yuju/types/app';
import useAxios from 'axios-hooks';
import {getAgeFromDate} from '@yuju/common/utils/age';
import DatePicker from 'react-native-date-picker';
import {useEditProfile} from '@yuju/global-hooks/useEditProfile';
import {AskScreenHeadingTitle} from '@yuju/components/organisms/AskScreenHeadingTitle';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'AskProfileDataScreen'> {}

export const AskProfileDataScreen: React.FC<Props> = ({
  route: {
    params: {avatar, referralCode},
  },
}) => {
  const {control, handleSubmit, formState, setError} = useEditProfile();
  const {
    isLoading,
    isValidating,
    mutate: mutateMyProfile,
  } = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });
  const {mutate: mutateIsNewUser} = useRequest<boolean>({
    method: 'GET',
    url: '/users/me/is-new',
  });
  const [{loading}, executeCreateProfile] = useAxios<
    CreateProfileResponse,
    CreateProfileBody
  >(
    {
      url: '/users/me',
      method: 'POST',
    },
    {manual: true},
  );
  const [showDateError, setDateError] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleFinish = handleSubmit(data => {
    const age = getAgeFromDate(date);

    if (age < 18) {
      setDateError(true);
      return;
    }

    setDateError(false);

    executeCreateProfile({
      data: {
        avatar,
        referredByCode: referralCode,
        email: data.email,
        dni: data.dni,
        phoneNumber: data.phone,
        birthDate: String(date),
      },
    })
      .then(async () => {
        await mutateMyProfile();
        await mutateIsNewUser();
      })
      .catch(error => {
        // Error: INVALID_DNI
        const isInvalidDNI = error?.response?.data.message === 'INVALID_DNI';

        if (isInvalidDNI) {
          setError('dni', {
            message: 'DNI inválido',
          });
        }
      });
  });

  return (
    <ScrollScreen>
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <AskScreenHeadingTitle
          title="¡Yuju!, ya casi acabas..."
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
                  mt="md"
                  placeholder="Correo electrónico"
                  keyboardType="email-address"
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
            onPress={handleFinish}
            block
            fontWeight="bold"
            rounded="lg"
            h={55}
            fontSize="3xl"
            loading={loading || isLoading || isValidating}>
            Finalizar
          </Button>
        </Div>
      </Div>
    </ScrollScreen>
  );
};

import React, {Fragment, useState} from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  StatusBar,
} from 'react-native';
import {
  Div,
  Text,
  Avatar,
  Icon,
  Button,
  Dropdown,
  Input,
} from 'react-native-magnus';
import DatePicker from 'react-native-date-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {
  GetMyProfile,
  UpdateProfileBody,
  UpdateProfileResponse,
} from '@yuju/types/app';
import {formatDate} from '@yuju/common/utils/format';
import {Controller} from 'react-hook-form';
import {monthNames} from '@yuju/common/utils/date';
import {useEditProfile} from '@yuju/global-hooks/useEditProfile';
import {getAgeFromDate} from '@yuju/common/utils/age';
import useAxios from 'axios-hooks';
import {PhotoPreviewOverlay} from '@yuju/components/atoms/PhotoPreviewOverlay';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'EditProfileScreen'> {}

export const EditProfileScreen: React.FC<Props> = ({navigation}) => {
  const {data: myProfile, mutate: mutateMyProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });
  const {
    openPhotoDropdown,
    openPhotoOverlay,
    takePhoto,
    pickPhotoFromGallery,
    closePhotoDropdown,
    closePhotoOverlay,
    photoDropdownRef,
    openDatePicker,
    closeDatePicker,
    photoPreviewOverlayVisible,
    seePhotoOverlay,
    datePickerOpen,
    handleChangeNameInfo,
    handleSubmit,
    formState,
    control,
    avatarToSend,
    avatarImageForEditProfile,
  } = useEditProfile({
    formDefaultValues: {
      dni: myProfile?.user.profile.dni,
      email: myProfile?.user.profile.email,
      phone: myProfile?.user.profile.phoneNumber,
    },
  });
  const [{loading}, executeUpdateProfile] = useAxios<
    UpdateProfileResponse,
    UpdateProfileBody
  >(
    {
      url: '/users/me',
      method: 'PUT',
    },
    {manual: true},
  );
  const [date, setDate] = useState(
    new Date(myProfile?.user.profile.birthDate!),
  );
  const [showDateError, setDateError] = useState(false);
  const [birthDateMonth, birthDateDay, birthDateYear] = date
    .toLocaleDateString()
    .split('/');

  const handleSave = handleSubmit(data => {
    const age = getAgeFromDate(date);

    if (age < 18) {
      setDateError(true);
      return;
    }

    setDateError(false);

    executeUpdateProfile({
      data: {
        avatar: avatarToSend,
        email: data.email,
        dni: data.dni,
        phoneNumber: data.phone,
        birthDate: String(date),
      },
    })
      .then(response => {
        if (response.data.modified) {
          mutateMyProfile();
          navigation.goBack();
        } else {
          navigation.goBack();
        }
      })
      .catch(console.log);
  });

  return (
    <Fragment>
      <ScrollScreen>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
          {/** Avatar {Profile Photo} */}
          <Div justifyContent="center" alignItems="center">
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={openPhotoDropdown}
              onLongPress={openPhotoOverlay}
              style={{
                borderRadius: 100,
              }}>
              <Button
                bg="white"
                right={0}
                bottom={15}
                w={35}
                h={35}
                p={0}
                zIndex={9}
                borderWidth={2}
                borderColor="gray100"
                rounded="circle"
                position="absolute"
                justifyContent="center"
                alignItems="center"
                alignSelf="center"
                textAlign="center"
                onPress={openPhotoDropdown}>
                <Icon
                  alignSelf="center"
                  fontFamily="Ionicons"
                  name="pencil"
                  color="black"
                  fontSize="lg"
                />
              </Button>
              <Div
                borderWidth={2}
                borderColor="gray100"
                w={150}
                h={150}
                rounded="circle"
                alignItems="center"
                justifyContent="center">
                <Avatar
                  size={145}
                  alignSelf="center"
                  rounded="circle"
                  bg="gray100"
                  source={avatarImageForEditProfile}
                />
              </Div>
            </TouchableOpacity>
          </Div>

          <Div my="lg" />

          {/** Name */}
          <Div mt="lg">
            <TouchableOpacity
              onPress={handleChangeNameInfo}
              activeOpacity={0.8}>
              <Text fontWeight="500" color="gray300">
                Tus Nombre(s) y Apellidos
              </Text>
              <Input
                value={myProfile?.user.profile.name}
                color="gray300"
                mt="md"
                placeholder="Nombre(s) y Apellidos"
                keyboardType="default"
                fontSize="lg"
                prefix={
                  <Icon
                    color="gray300"
                    fontFamily="Ionicons"
                    name="person"
                    mr="xs"
                  />
                }
                borderColor="gray300"
                rounded="lg"
                focusBorderColor="primary700"
                editable={false}
                focusable={false}
              />
            </TouchableOpacity>
          </Div>

          {/** Email */}
          <Div mt="lg">
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
                  prefix={<Icon fontFamily="Ionicons" name="mail" mr="xs" />}
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

          <Div mt="lg">
            <Text fontWeight="500" color="gray500">
              Fecha de nacimiento
            </Text>
            <TouchableNativeFeedback
              onPress={openDatePicker}
              background={TouchableNativeFeedback.Ripple('#f3f4f6', false)}>
              <Div
                py="lg"
                mt="md"
                row
                flex={1}
                justifyContent="space-between"
                alignItems="center">
                <Div
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  borderBottomWidth={1}
                  borderBottomColor="gray300">
                  <Text fontWeight="bold" fontSize="xl" mb="xs" color="gray600">
                    {birthDateDay}
                  </Text>
                </Div>

                {/** Spacing */}
                <Div flex={0.2} />

                <Div
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  borderBottomWidth={1}
                  borderBottomColor="gray300">
                  <Text fontWeight="bold" fontSize="xl" mb="xs" color="gray600">
                    {monthNames[+birthDateMonth - 1]}
                  </Text>
                </Div>

                {/** Spacing */}
                <Div flex={0.2} />

                <Div
                  flex={1}
                  justifyContent="center"
                  alignItems="center"
                  borderBottomWidth={1}
                  borderBottomColor="gray300">
                  <Text fontWeight="bold" fontSize="xl" mb="xs" color="gray600">
                    {birthDateYear}
                  </Text>
                </Div>
              </Div>
            </TouchableNativeFeedback>
            {showDateError && (
              <Text color="red" mt={2} fontWeight="500">
                Tienes que ser mayor de edad.
              </Text>
            )}
          </Div>

          <Div my="lg" />

          <Div mt="lg">
            <Text fontSize="lg" color="gray400">
              Te uniste{' '}
              <Text fontSize="lg" color="gray500" fontWeight="600">
                {formatDate(new Date(myProfile?.user.createdAt!))}
              </Text>
              .
            </Text>
          </Div>

          <Div my="lg" />

          <Div mt="lg">
            <Button
              bg="primary500"
              rounded="lg"
              block
              fontWeight="bold"
              h={55}
              loading={loading}
              fontSize="3xl"
              onPress={handleSave}>
              Guardar
            </Button>
          </Div>
        </Div>
      </ScrollScreen>

      {/** Modals */}

      <Dropdown
        backdropColor="#000"
        ref={photoDropdownRef}
        title={
          <Text px="xl" color="gray500" pb="md" fontWeight="500">
            Foto de perfil
          </Text>
        }
        mt="md"
        pb="2xl"
        showSwipeIndicator={true}
        roundedTop="lg">
        <Dropdown.Option
          value="TAKE_PHOTO"
          py="lg"
          px="xl"
          block
          fontWeight="500"
          prefix={
            <Icon
              name="camera"
              fontFamily="Ionicons"
              mr="lg"
              color="purple500"
              fontSize="4xl"
            />
          }
          onPress={takePhoto}>
          Tomar foto
        </Dropdown.Option>
        <Dropdown.Option
          value="PICK_FROM_GALLERY"
          py="lg"
          px="xl"
          block
          fontWeight="500"
          prefix={
            <Icon
              name="images"
              fontFamily="Ionicons"
              mr="lg"
              color="indigo500"
              fontSize="4xl"
            />
          }
          onPress={pickPhotoFromGallery}>
          Seleccionar desde Galería
        </Dropdown.Option>
        <Dropdown.Option
          value="PREVIEW_PHOTO"
          py="lg"
          px="xl"
          block
          fontWeight="500"
          prefix={
            <Icon
              name="eye"
              fontFamily="Ionicons"
              mr="lg"
              color="info500"
              fontSize="4xl"
            />
          }
          onPress={seePhotoOverlay}>
          Ver foto
        </Dropdown.Option>
        <Dropdown.Option
          value="CANCEL_DROPDOWN"
          py="lg"
          px="xl"
          block
          fontWeight="500"
          prefix={
            <Icon
              name="close"
              fontFamily="Ionicons"
              mr="lg"
              fontSize="4xl"
              color="red500"
            />
          }
          onPress={closePhotoDropdown}>
          Cancelar
        </Dropdown.Option>
      </Dropdown>

      {photoPreviewOverlayVisible ? (
        <PhotoPreviewOverlay
          avatar={avatarImageForEditProfile}
          closePhotoOverlay={closePhotoOverlay}
          photoPreviewOverlayVisible={photoPreviewOverlayVisible}
        />
      ) : null}

      {datePickerOpen ? (
        <DatePicker
          modal
          mode="date"
          theme="light"
          confirmText="Confirmar"
          cancelText="Cancelar"
          // Si es dark theme debe ser none, si es light theme no debería estar
          fadeToColor="none"
          title="Fecha de nacimiento"
          androidVariant="iosClone"
          open={datePickerOpen}
          date={date}
          onConfirm={date => {
            closeDatePicker();
            setDate(date);
          }}
          onCancel={closeDatePicker}
        />
      ) : null}
    </Fragment>
  );
};

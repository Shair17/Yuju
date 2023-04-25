import React, {useEffect, Fragment, useState} from 'react';
import {Alert, StatusBar} from 'react-native';
import {Button, Div, Dropdown, Icon, Input, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../stacks/ProfileStackScreen';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {Controller} from 'react-hook-form';
import {EventArg} from '@react-navigation/native';
import {AskVehicleDataScreenPhotoItem} from '@yuju/components/atoms/AskVehicleDataScreenPhotoItem';
import {useEditVehicleData} from '@yuju/global-hooks/useEditVehicleData';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'EditVehicleScreen'> {}

export const EditVehicleScreen: React.FC<Props> = ({navigation}) => {
  const {
    handleSubmit,
    isValidPhoto,
    vehiclePhotos,
    executeUpdateVehicle,
    mutateMyVehicle,
    handleShowNotification,
    openPhotoDropdown,
    closePhotoDropdown,
    formState,
    photoDropdownRef,
    isLoading,
    hasUnsavedChanges,
    control,
    pickPhotoFromGallery,
    takePhoto,
    randomPlate,
    buildBase64,
    executeUploadPhotos,
  } = useEditVehicleData();
  const [canGoBack, setCanGoBack] = useState(!hasUnsavedChanges);

  const handleSave = handleSubmit(async data => {
    let [firstPhoto, secondPhoto, thirdPhoto, fourthPhoto, fifthPhoto] =
      vehiclePhotos;

    if (isValidPhoto(firstPhoto)) {
      const photoResponse = await executeUploadPhotos({
        data: {
          file: buildBase64(firstPhoto),
          upload_preset: 'my_preset',
        },
      });

      firstPhoto = photoResponse.data.secure_url as string;
    }

    if (isValidPhoto(secondPhoto)) {
      const photoResponse = await executeUploadPhotos({
        data: {
          file: buildBase64(secondPhoto),
          upload_preset: 'my_preset',
        },
      });

      secondPhoto = photoResponse.data.secure_url as string;
    }

    if (isValidPhoto(thirdPhoto)) {
      const photoResponse = await executeUploadPhotos({
        data: {
          file: buildBase64(thirdPhoto),
          upload_preset: 'my_preset',
        },
      });

      thirdPhoto = photoResponse.data.secure_url as string;
    }

    if (isValidPhoto(fourthPhoto)) {
      const photoResponse = await executeUploadPhotos({
        data: {
          file: buildBase64(fourthPhoto),
          upload_preset: 'my_preset',
        },
      });

      fourthPhoto = photoResponse.data.secure_url as string;
    }

    if (isValidPhoto(fifthPhoto)) {
      const photoResponse = await executeUploadPhotos({
        data: {
          file: buildBase64(fifthPhoto),
          upload_preset: 'my_preset',
        },
      });

      fifthPhoto = photoResponse.data.secure_url as string;
    }

    const vehiclePhotosToUpload = [
      firstPhoto,
      secondPhoto,
      thirdPhoto,
      fourthPhoto,
      fifthPhoto,
    ].filter(Boolean);

    executeUpdateVehicle({
      data: {
        plate: data.plate,
        vehiclePhotos: vehiclePhotosToUpload,
      },
    })
      .then(async response => {
        if (response.data.modified) {
          await mutateMyVehicle();
        }

        handleShowNotification('Tus cambios fueron guardados.');

        navigation.goBack();
      })
      .catch(() => {
        handleShowNotification('Ocurrió un error inesperado.');

        navigation.goBack();
      });
  });

  useEffect(() => setCanGoBack(!hasUnsavedChanges), [hasUnsavedChanges]);

  useEffect(() => {
    const listener = (
      e: EventArg<
        'beforeRemove',
        true,
        {
          action: Readonly<{
            type: string;
          }>;
        }
      >,
    ) => {
      if (!hasUnsavedChanges || canGoBack) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        'Descartar cambios?',
        'Tienes cambios sin guardar, seguro que quieres irte sin guardarlos?',
        [
          {text: 'No', style: 'cancel'},
          {
            text: 'Sí',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ],
      );
    };

    navigation.addListener('beforeRemove', listener);

    return () => navigation.removeListener('beforeRemove', listener);
  }, [navigation, hasUnsavedChanges, canGoBack]);

  return (
    <Fragment>
      <ScrollScreen>
        <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
          {/** Plate */}
          <Div>
            <Text fontWeight="500" color="gray500">
              Placa de tu mototaxi
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
                maxLength: 6,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <Div position="relative">
                  <Input
                    mt="md"
                    placeholder={`Por ejemplo: ${randomPlate}`}
                    keyboardType="default"
                    maxLength={6}
                    autoCapitalize="characters"
                    fontSize="lg"
                    rounded="lg"
                    focusBorderColor="primary700"
                    fontWeight="500"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    borderColor={formState.errors.plate ? 'red' : 'gray400'}
                  />
                </Div>
              )}
              name="plate"
            />
            {formState.errors.plate ? (
              <Text color="red" mt={2} fontWeight="500">
                La placa de tu mototaxi es requerida.
              </Text>
            ) : null}
          </Div>

          {/** Vehicle Photos */}
          <Div mt="lg">
            <Text fontWeight="500" color="gray500">
              Fotos de tu Mototaxi
            </Text>

            <Div row mt="md">
              <AskVehicleDataScreenPhotoItem
                bg={vehiclePhotos[0]}
                onPress={() => openPhotoDropdown(0)}
                text="Foto"
                containerProps={{
                  mr: 'xs',
                }}
              />

              <AskVehicleDataScreenPhotoItem
                bg={vehiclePhotos[1]}
                onPress={() => openPhotoDropdown(1)}
                text="Foto"
                containerProps={{
                  ml: 'xs',
                }}
              />
            </Div>
            <Div row mt="md">
              <AskVehicleDataScreenPhotoItem
                bg={vehiclePhotos[2]}
                onPress={() => openPhotoDropdown(2)}
                text="Foto"
                containerProps={{
                  mr: 'xs',
                }}
              />

              <AskVehicleDataScreenPhotoItem
                bg={vehiclePhotos[3]}
                onPress={() => openPhotoDropdown(3)}
                text="Foto"
                containerProps={{
                  ml: 'xs',
                }}
              />
            </Div>
            <Div row mt="md">
              <AskVehicleDataScreenPhotoItem
                bg={vehiclePhotos[4]}
                onPress={() => openPhotoDropdown(4)}
                text="Foto"
              />
            </Div>
          </Div>

          <Div mt="xl">
            <Button
              onPress={handleSave}
              block
              fontWeight="bold"
              rounded="lg"
              h={55}
              fontSize="3xl"
              loading={isLoading}>
              Guardar
            </Button>
          </Div>
        </Div>
      </ScrollScreen>

      <Dropdown
        ref={photoDropdownRef}
        backdropColor="#000"
        title={
          <Text px="xl" color="gray500" pb="md" fontWeight="500">
            Subir Fotos de tu Mototaxi
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
    </Fragment>
  );
};

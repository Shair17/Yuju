import React, {useEffect, useMemo, Fragment} from 'react';
import {StatusBar} from 'react-native';
import {Div, Icon, Input, Text, Button, Dropdown} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {Controller} from 'react-hook-form';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {
  CreateProfileBody,
  CreateProfileResponse,
  GetMyProfile,
  GetMyVehicle,
} from '@yuju/types/app';
import {AskScreenHeadingTitle} from '@yuju/components/organisms/AskScreenHeadingTitle';
import useAxios from 'axios-hooks';
import {getRandomPlate} from '@yuju/common/utils/random';
import {FooterLegalLinks} from '@yuju/components/molecules/FooterLegalLinks';
import {showAlert, showNotification} from '@yuju/common/utils/notification';
import {AskVehicleDataScreenPhotoItem} from '@yuju/components/atoms/AskVehicleDataScreenPhotoItem';
import {useUploadDocuments} from '@yuju/global-hooks/useUploadDocuments';
import {useCloudinary, buildBase64} from '@yuju/common/utils/cloudinary';
import {CLOUDINARY_API} from '@yuju/common/constants/cloudinary';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'AskVehicleDataScreen'> {}

export const AskVehicleDataScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: {
      avatar,
      referralCode: referredByCode,
      email,
      dni,
      phoneNumber,
      birthDate,
      summary,
    },
  },
}) => {
  const {
    mutate: mutateMyProfile,
    isLoading: myProfileIsLoading,
    isValidating: myProfileIsValidating,
  } = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/drivers/me',
  });
  const {
    mutate: mutateMyVehicle,
    isLoading: myVehicleIsLoading,
    isValidating: myVehicleIsValidating,
  } = useRequest<GetMyVehicle>({
    method: 'GET',
    url: '/drivers/me/vehicle',
    params: {
      skipIsNewValidation: true,
    },
  });
  const {
    mutate: mutateImNewUser,
    isLoading: imNewUserIsLoading,
    isValidating: imNewUserIsValidating,
  } = useRequest<boolean>({
    method: 'GET',
    url: '/drivers/im-new',
  });
  const [{loading: createProfileIsLoading}, executeCreateProfile] = useAxios<
    CreateProfileResponse,
    CreateProfileBody
  >(
    {
      url: '/drivers/me',
      method: 'POST',
    },
    {manual: true},
  );
  const [{loading: uploadPhotosIsLoading}, executeUploadPhotos] = useCloudinary(
    {
      url: CLOUDINARY_API,
      method: 'POST',
    },
    {manual: true},
  );
  const {
    control,
    formState,
    handleSubmit,
    pickPhotoFromGallery,
    takePhoto,
    photos,
    openPhotoDropdown,
    closePhotoDropdown,
    photoDropdownRef,
  } = useUploadDocuments();
  const randomPlate = useMemo(getRandomPlate, []);

  const handleFinish = handleSubmit(async data => {
    const hasPhotos = photos.every(photo => !!photo) && photos.length === 2;

    if (!hasPhotos) {
      showAlert({
        title: 'Advertencia',
        description: 'Tienes que subir todo lo solicitado.',
        alertType: 'warn',
      });
      return;
    }

    const [firstPhoto, secondPhoto] = photos;

    const firstPhotoResponse = await executeUploadPhotos({
      data: {
        file: buildBase64(firstPhoto.assets![0].base64!),
        upload_preset: 'my_preset',
      },
    });

    const secondPhotoResponse = await executeUploadPhotos({
      data: {
        file: buildBase64(secondPhoto.assets![0].base64!),
        upload_preset: 'my_preset',
      },
    });

    const vehiclePhotos = [
      firstPhotoResponse.data.secure_url,
      secondPhotoResponse.data.secure_url,
    ];

    executeCreateProfile({
      data: {
        avatar,
        referredByCode,
        email,
        dni,
        phoneNumber,
        birthDate,
        summary,
        vehiclePhotos,
        plate: data.plate,
        // dniPhotos,
        // license,
        // propertyCard,
        // circulationCard,
        // technicalReview,
        // soat,
      },
    })
      .then(async () => {
        await mutateImNewUser();
        await mutateMyProfile();
        await mutateMyVehicle();
      })
      .catch();
  });

  useEffect(
    () =>
      showNotification({
        title: 'Yuju',
        description: 'Es importante subir tus documentos en buena calidad.',
        duration: 10000,
      }),
    [],
  );

  return (
    <Fragment>
      <ScrollScreen>
        <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
          <AskScreenHeadingTitle
            title="Estás a un paso de formar parte de Yuju!"
            subtitle="Es extremadamente importante agregar tus datos reales, así tus clientes estarán más seguros y felices contigo."
          />

          <Text mt="lg" fontSize={10} color="gray500">
            * Cuando envíes tus datos se validan automáticamente y tarda unos
            minutos en aprobarse tu cuenta.
          </Text>

          <Div mt="lg">
            {/** Plate */}
            <Div mt="lg">
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

            {/** DNI Photos */}
            {/* <Div mt="lg">
              <Text fontWeight="500" color="gray500">
                Fotos de tu DNI (Ambos lados)
              </Text>

              <Div row mt="md">
                <AskVehicleDataScreenPhotoItem
                  bg={documents.dniPhotos[0]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('dniPhotos');
                  }}
                  text="Frente"
                  containerProps={{
                    mr: 'xs',
                  }}
                />

                <AskVehicleDataScreenPhotoItem
                  bg={documents.dniPhotos[1]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('dniPhotos');
                  }}
                  text="Atrás"
                  containerProps={{
                    ml: 'xs',
                  }}
                />
              </Div>
            </Div> */}

            {/** License Photos */}
            {/* <Div mt="lg">
              <Text fontWeight="500" color="gray500">
                Fotos de tu Licencia de Conducir (Ambos lados)
              </Text>

              <Div row mt="md">
                <AskVehicleDataScreenPhotoItem
                  bg={documents.license[0]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('license');
                  }}
                  text="Frente"
                  containerProps={{
                    mr: 'xs',
                  }}
                />

                <AskVehicleDataScreenPhotoItem
                  bg={documents.license[1]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('license');
                  }}
                  text="Atrás"
                  containerProps={{
                    ml: 'xs',
                  }}
                />
              </Div>
            </Div> */}

            {/** Property Card Photos */}
            {/* <Div mt="lg">
              <Text fontWeight="500" color="gray500">
                Fotos de tu Tarjeta de Propiedad (Ambos lados)
              </Text>

              <Div row mt="md">
                <AskVehicleDataScreenPhotoItem
                  bg={documents.propertyCard[0]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('propertyCard');
                  }}
                  text="Frente"
                  containerProps={{
                    mr: 'xs',
                  }}
                />

                <AskVehicleDataScreenPhotoItem
                  bg={documents.propertyCard[1]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('propertyCard');
                  }}
                  text="Atrás"
                  containerProps={{
                    ml: 'xs',
                  }}
                />
              </Div>
            </Div> */}

            {/** Circulation Card Photos */}
            {/* <Div mt="lg">
              <Text fontWeight="500" color="gray500">
                Fotos de tu Tarjeta de Circulación (Ambos lados)
              </Text>

              <Div row mt="md">
                <AskVehicleDataScreenPhotoItem
                  bg={documents.circulationCard[0]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('circulationCard');
                  }}
                  text="Frente"
                  containerProps={{
                    mr: 'xs',
                  }}
                />

                <AskVehicleDataScreenPhotoItem
                  bg={documents.propertyCard[1]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('circulationCard');
                  }}
                  text="Atrás"
                  containerProps={{
                    ml: 'xs',
                  }}
                />
              </Div>
            </Div> */}

            {/** Technical Review Photos */}
            {/* <Div mt="lg">
              <Text fontWeight="500" color="gray500">
                Fotos de tu Revisión Técnica (Ambos lados)
              </Text>

              <Div row mt="md">
                <AskVehicleDataScreenPhotoItem
                  bg={documents.technicalReview[0]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('technicalReview');
                  }}
                  text="Frente"
                  containerProps={{
                    mr: 'xs',
                  }}
                />

                <AskVehicleDataScreenPhotoItem
                  bg={documents.technicalReview[1]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('technicalReview');
                  }}
                  text="Atrás"
                  containerProps={{
                    ml: 'xs',
                  }}
                />
              </Div>
            </Div> */}

            {/** SOAT Photos */}
            {/* <Div mt="lg">
              <Text fontWeight="500" color="gray500">
                Fotos de tu SOAT
              </Text>

              <Div row mt="md">
                <AskVehicleDataScreenPhotoItem
                  bg={documents.soat?.[0]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('soat');
                  }}
                  text="Foto"
                  containerProps={{
                    mr: 'xs',
                  }}
                />

                <AskVehicleDataScreenPhotoItem
                  bg={documents.soat?.[1]?.assets![0].uri}
                  onPress={() => {
                    openPhotoDropdown('soat');
                  }}
                  text="Foto"
                  containerProps={{
                    ml: 'xs',
                  }}
                />
              </Div>
            </Div> */}

            {/** Vehicle Photos */}
            <Div mt="lg">
              <Text fontWeight="500" color="gray500">
                Fotos de tu Mototaxi
              </Text>

              <Div row mt="md">
                <AskVehicleDataScreenPhotoItem
                  bg={photos[0]?.assets![0].uri}
                  onPress={openPhotoDropdown}
                  text="Foto"
                  containerProps={{
                    mr: 'xs',
                  }}
                />

                <AskVehicleDataScreenPhotoItem
                  bg={photos?.[1]?.assets![0].uri}
                  onPress={openPhotoDropdown}
                  text="Foto"
                  containerProps={{
                    ml: 'xs',
                  }}
                />
              </Div>
              <Text mt="xs" fontSize={10} color="gray500">
                * Puedes agregar más o actualizar las fotos de tu mototaxi más
                adelante.
              </Text>
            </Div>
          </Div>

          <Div mt="xl">
            <FooterLegalLinks message="Al enviar tus datos" />
          </Div>

          <Div mt="xl">
            <Button
              onPress={handleFinish}
              block
              fontWeight="bold"
              rounded="lg"
              h={55}
              fontSize="3xl"
              loading={
                uploadPhotosIsLoading ||
                createProfileIsLoading ||
                myProfileIsLoading ||
                myProfileIsValidating ||
                myVehicleIsLoading ||
                myVehicleIsValidating ||
                imNewUserIsLoading ||
                imNewUserIsValidating
              }>
              Finalizar
            </Button>
          </Div>

          <Text mt="xs" fontSize={10} color="gray500">
            * Tus datos se usan únicamente para validar tu identidad y no son
            compartidos con nadie.
          </Text>
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

import React, {Fragment} from 'react';
import {TouchableOpacity} from 'react-native';
import {Div, Text, Button, Avatar, Icon, Dropdown} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';
import {useEditProfile} from '@yuju/global-hooks/useEditProfile';
import {PhotoPreviewOverlay} from '@yuju/components/atoms/PhotoPreviewOverlay';
import {AskScreenHeadingTitle} from '@yuju/components/organisms/AskScreenHeadingTitle';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'AskAvatarScreen'> {}

export const AskAvatarScreen: React.FC<Props> = ({
  navigation,
  route: {
    params: {referralCode},
  },
}) => {
  const {
    handleRemoveAvatar,
    pickPhotoFromGallery,
    takePhoto,
    avatarImage,
    photoPreviewOverlayVisible,
    openPhotoDropdown,
    closePhotoDropdown,
    closePhotoOverlay,
    seePhotoOverlay,
    openPhotoOverlay,
    photoDropdownRef,
    avatarToSend,
  } = useEditProfile();

  const handleNext = () => {
    navigation.navigate('AskProfileDataScreen', {
      avatar: avatarToSend,
      referralCode,
    });
  };

  return (
    <Fragment>
      <Div flex={1} bg="body">
        <Div flex={1} p="2xl">
          <Div flex={3}>
            <AskScreenHeadingTitle
              title="Es momento de resaltar en Yuju, agrega una foto de perfil."
              subtitle="Puedes hacerlo más tarde, no hay problema."
            />

            <Div flex={1} justifyContent="center" alignItems="center">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={openPhotoDropdown}
                onLongPress={openPhotoOverlay}
                style={{
                  borderRadius: 100,
                }}>
                <Div
                  borderWidth={2}
                  borderColor="gray100"
                  w={250}
                  h={250}
                  rounded="circle"
                  alignItems="center"
                  justifyContent="center">
                  <Avatar
                    size={245}
                    alignSelf="center"
                    rounded="circle"
                    bg="gray100"
                    source={avatarImage}
                  />
                </Div>
              </TouchableOpacity>
              <Text mt="lg" fontSize={10} color="gray400">
                Presiona en la foto de perfil para mostrar las opciones.
              </Text>
            </Div>
          </Div>

          <Div flex={1} justifyContent="center" alignItems="center">
            <Button
              block
              fontWeight="bold"
              rounded="lg"
              h={55}
              fontSize="3xl"
              onPress={handleNext}>
              Continuar
            </Button>
          </Div>
        </Div>
      </Div>

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
          value="DELETE_PHOTO_DROPDOWN"
          py="lg"
          px="xl"
          block
          fontWeight="500"
          prefix={
            <Icon
              name="trash"
              fontFamily="Ionicons"
              mr="lg"
              fontSize="4xl"
              color="danger500"
            />
          }
          onPress={handleRemoveAvatar}>
          Eliminar foto
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
          avatar={avatarImage}
          photoPreviewOverlayVisible={photoPreviewOverlayVisible}
          closePhotoOverlay={closePhotoOverlay}
        />
      ) : null}
    </Fragment>
  );
};

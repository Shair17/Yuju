import {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {PermissionsAndroid} from 'react-native';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {DropdownRef} from 'react-native-magnus';
import {zodResolver} from '@hookform/resolvers/zod';
import {GetMyProfile} from '@yuju/types/app';
import {useRequest} from './useRequest';
import {showAlert, showNotification} from '@yuju/common/utils/notification';
import {
  EditProfileFormDataValues,
  EditProfileSchemaValidator,
} from '@yuju/common/schemas/edit-profile.schema';

const avatarPlaceholderImage = require('@yuju/assets/images/avatar-placeholder.jpg');

interface Props {
  formDefaultValues?: Partial<EditProfileFormDataValues>;
}

export const useEditProfile = ({formDefaultValues}: Props = {}) => {
  const [avatar, setAvatar] = useState<ImagePickerResponse | undefined>(
    undefined,
  );
  const [photoPreviewOverlayVisible, setPhotoPreviewOverlayVisible] =
    useState<boolean>(false);
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const photoDropdownRef = useRef<DropdownRef>(null);
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/drivers/me',
  });
  const {control, handleSubmit, formState, watch, setError} =
    useForm<EditProfileFormDataValues>({
      resolver: zodResolver(EditProfileSchemaValidator),
      defaultValues: formDefaultValues,
    });

  const userPickedAvatar = avatar !== undefined && avatar?.assets !== undefined;
  const avatarImage = userPickedAvatar
    ? {uri: avatar!.assets![0].uri}
    : avatarPlaceholderImage;
  const avatarImageForEditProfile = userPickedAvatar
    ? {uri: avatar!.assets![0].uri}
    : {uri: myProfile?.driver.profile.avatar};

  const avatarToSend =
    avatar !== undefined && avatar?.assets !== undefined
      ? `data:image/jpg;base64,${avatar.assets[0].base64}`
      : undefined;

  const openDatePicker = () => {
    setDatePickerOpen(true);
  };

  const closeDatePicker = () => {
    setDatePickerOpen(false);
  };

  const takePhoto = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const photo = await launchCamera({
          maxHeight: 500,
          maxWidth: 500,
          mediaType: 'photo',
          includeBase64: true,
          quality: 0.5,
        });

        setAvatar(photo);
      } else {
        showNotification({
          title: 'Yuju',
          description:
            'Los permisos a la camara fueron denegados por ti, por favor acepta los permisos.',
        });
      }
    } catch (err) {
      showNotification({
        title: 'Yuju',
        description: 'Ocurrió un error inesperado solicitando los permisos',
      });
    }
  };

  const pickPhotoFromGallery = async () => {
    const photo = await launchImageLibrary({
      maxHeight: 500,
      maxWidth: 500,
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
    });

    setAvatar(photo);
  };

  const handleRemoveAvatar = () => {
    setAvatar(undefined);
  };

  const openPhotoDropdown = () => {
    photoDropdownRef.current?.open();
  };

  const closePhotoDropdown = () => {
    photoDropdownRef.current?.close();
  };

  const openPhotoOverlay = () => {
    setPhotoPreviewOverlayVisible(true);
  };

  const closePhotoOverlay = () => {
    setPhotoPreviewOverlayVisible(false);
  };

  const seePhotoOverlay = () => {
    openPhotoOverlay();
    closePhotoDropdown();
  };

  const handleChangeNameInfo = () => {
    showAlert({
      title: 'Advertencia',
      description: 'No puedes editar tu nombre.',
      alertType: 'warn',
    });
  };

  // 'Tus cambios fueron guardados.'
  // 'Ocurrió un error inesperado.'

  const handleShowNotification = (message: string) => {
    showNotification({
      title: 'Yuju',
      description: message,
    });
  };

  return {
    handleShowNotification,
    control,
    watch,
    setError,
    handleSubmit,
    formState,
    avatar,
    handleRemoveAvatar,
    takePhoto,
    pickPhotoFromGallery,
    userPickedAvatar,
    avatarImage,
    photoPreviewOverlayVisible,
    openPhotoDropdown,
    closePhotoDropdown,
    seePhotoOverlay,
    closePhotoOverlay,
    openPhotoOverlay,
    photoDropdownRef,
    openDatePicker,
    closeDatePicker,
    datePickerOpen,
    handleChangeNameInfo,
    avatarToSend,
    avatarImageForEditProfile,
  };
};

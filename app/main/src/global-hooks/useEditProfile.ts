import {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {PermissionsAndroid} from 'react-native';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {DropdownRef} from 'react-native-magnus';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {zodResolver} from '@hookform/resolvers/zod';
import {DNI_REGEX} from '@yuju/common/regex';
import {GetMyProfile} from '@yuju/types/app';
import {z} from 'zod';
import {useRequest} from './useRequest';

type FormDataValues = {
  email: string;
  dni: string;
  phone: string;
};

export const schemaValidator = z.object({
  email: z.string().email({message: 'Correo electrónico inválido'}),
  dni: z.string().min(8).max(8).regex(DNI_REGEX, {message: 'DNI inválido'}),
  phone: z.string().min(9).max(9, {message: 'Número de celular inválido'}),
});

const avatarPlaceholderImage = require('@yuju/assets/images/avatar-placeholder.jpg');

interface Props {
  formDefaultValues?: Partial<FormDataValues>;
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
    url: '/users/me',
  });
  const {control, handleSubmit, formState} = useForm<FormDataValues>({
    resolver: zodResolver(schemaValidator),
    defaultValues: formDefaultValues,
  });
  const userPickedAvatar = avatar !== undefined && avatar?.assets !== undefined;
  const avatarImage = userPickedAvatar
    ? {uri: avatar!.assets![0].uri}
    : avatarPlaceholderImage;
  const avatarImageForEditProfile = userPickedAvatar
    ? {uri: avatar!.assets![0].uri}
    : {uri: myProfile?.user.profile.avatar};

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
        Notifier.showNotification({
          title: 'Yuju',
          description:
            'Los permisos a la camara fueron denegados por ti, por favor acepta los permisos.',
        });
      }
    } catch (err) {
      console.log(err);

      Notifier.showNotification({
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
    Notifier.showNotification({
      title: 'Advertencia',
      description: 'No puedes editar tu nombre.',
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: 'warn',
      },
    });
  };

  return {
    control,
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

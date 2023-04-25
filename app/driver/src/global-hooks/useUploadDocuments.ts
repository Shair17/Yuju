import {useRef, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import z from 'zod';
import {showNotification} from '@yuju/common/utils/notification';
import {PermissionsAndroid} from 'react-native';
import {DropdownRef} from 'react-native-magnus';

export type AskVehicleDataFormDataValues = {
  // summary: string;
  plate: string;
};

export const AskVehicleDataSchemaValidator = z.object({
  // summary: z.string().min(5).max(100),
  plate: z.string().min(6).max(6),
});

export const useUploadDocuments = () => {
  const {control, handleSubmit, formState} =
    useForm<AskVehicleDataFormDataValues>({
      resolver: zodResolver(AskVehicleDataSchemaValidator),
    });
  const photoDropdownRef = useRef<DropdownRef>(null);
  const [photos, setPhotos] = useState<ImagePickerResponse[]>([]);

  const openPhotoDropdown = () => {
    photoDropdownRef.current?.open();
  };

  const closePhotoDropdown = () => {
    photoDropdownRef.current?.close();
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

        if (photo.didCancel || !photo.assets) return;

        if (photos.length === 0) {
          setPhotos([photo]);
        } else if (photos.length === 1) {
          setPhotos([...photos, photo]);
        } else {
          setPhotos([photo]);
        }
      } else {
        showNotification({
          title: 'Error',
          description:
            'Permisos de la cámara denegados por ti, por favor permite los permisos.',
        });
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        description: 'Ha ocurrido un error inesperado.',
      });
    }
  };

  const pickPhotoFromGallery = async () => {
    try {
      const photo = await launchImageLibrary({
        maxHeight: 500,
        maxWidth: 500,
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.5,
        selectionLimit: 1,
      });

      if (photo.didCancel || !photo.assets) return;

      if (photos.length === 0) {
        setPhotos([photo]);
      } else if (photos.length === 1) {
        setPhotos([...photos, photo]);
      } else {
        setPhotos([photo]);
      }
    } catch (error) {
      showNotification({
        title: 'Error',
        description: 'Ha ocurrido un error inesperado.',
      });
    }
  };

  return {
    control,
    handleSubmit,
    formState,
    takePhoto,
    photos,
    pickPhotoFromGallery,
    openPhotoDropdown,
    closePhotoDropdown,
    photoDropdownRef,
  };
};

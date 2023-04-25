import {useState, useRef} from 'react';
import {Alert, PermissionsAndroid} from 'react-native';
import {DropdownRef} from 'react-native-magnus';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {Notifier} from 'react-native-notifier';

export const useUploadPhotos = () => {
  const [photos, setPhotos] = useState<ImagePickerResponse['assets']>();
  const photoDropdownRef = useRef<DropdownRef>(null);
  const [photoPreviewOverlayVisible, setPhotoPreviewOverlayVisible] =
    useState<boolean>(false);
  const [currentSelectedPhoto, setCurrentSelectedPhoto] = useState<
    string | undefined
  >(undefined);

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

        if (!photo.assets) return;

        if (photos) {
          setPhotos([...photos, ...photo.assets]);
        } else {
          setPhotos([...photo.assets]);
        }
      } else {
        Notifier.showNotification({
          title: 'Error',
          description:
            'Camerra permissions denied by you, please allow permissions.',
        });
      }
    } catch (error) {
      // console.log(error);

      Notifier.showNotification({
        title: 'Error',
        description: 'An unknown error has occurred.',
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
      });

      if (photo.didCancel || !photo.assets) return;

      if (photos) {
        setPhotos([...photos, ...photo.assets]);
      } else {
        setPhotos([...photo.assets]);
      }
    } catch (error) {
      Notifier.showNotification({
        title: 'Error',
        description: 'An unknown error has occurred.',
      });
    }
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

  const setPhotoOverlay = (photo: string) => {
    setCurrentSelectedPhoto(photo);
  };

  const openPhotoPreview = (photo: string) => {
    setPhotoOverlay(photo);
    openPhotoOverlay();
  };

  return {
    openPhotoPreview,
    currentSelectedPhoto,
    closePhotoOverlay,
    openPhotoOverlay,
    photoPreviewOverlayVisible,
    photos,
    photoDropdownRef,
    openPhotoDropdown,
    closePhotoDropdown,
    takePhoto,
    pickPhotoFromGallery,
  };
};

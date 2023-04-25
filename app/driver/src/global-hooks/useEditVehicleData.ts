import {useMemo, useRef, useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {URL_REGEX} from '@yuju/common/regex';
import {useCloudinary, buildBase64} from '@yuju/common/utils/cloudinary';
import {CLOUDINARY_API} from '@yuju/common/constants/cloudinary';
import {useRequest} from './useRequest';
import {
  GetMyVehicle,
  UpdateVehicleBody,
  UpdateVehicleResponse,
} from '@yuju/types/app';
import useAxios from 'axios-hooks';
import {
  EditVehicleFormDataValues,
  EditVehicleSchemaValidator,
} from '@yuju/common/schemas/edit-vehicle.schema';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {getRandomPlate} from '@yuju/common/utils/random';
import {showNotification} from '@yuju/common/utils/notification';
import {PermissionsAndroid} from 'react-native';
import {DropdownRef} from 'react-native-magnus';

type PhotoIndex = 0 | 1 | 2 | 3 | 4;

export const useEditVehicleData = () => {
  const {
    mutate: mutateMyVehicle,
    isLoading: myVehicleIsLoading,
    isValidating: myVehicleIsValidating,
    data: myVehicle,
  } = useRequest<GetMyVehicle>({
    method: 'GET',
    url: '/drivers/me/vehicle',
    params: {
      skipIsNewValidation: true,
    },
  });
  const [{loading: updateVehicleIsLoading}, executeUpdateVehicle] = useAxios<
    UpdateVehicleResponse,
    UpdateVehicleBody
  >(
    {
      url: '/vehicles/me',
      method: 'PUT',
    },
    {manual: true},
  );
  const {control, handleSubmit, formState, watch, setError} =
    useForm<EditVehicleFormDataValues>({
      resolver: zodResolver(EditVehicleSchemaValidator),
      defaultValues: {
        plate: myVehicle?.plate,
      },
    });
  const hasUnsavedChanges =
    formState.isValid && !!myVehicle && myVehicle.plate !== watch('plate');
  const [vehiclePhotos, setVehiclePhotos] = useState<string[]>(
    myVehicle?.vehiclePhotos ?? [],
  );
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<PhotoIndex>(0);
  const randomPlate = useMemo(getRandomPlate, []);
  const [{loading: uploadPhotosIsLoading, error}, executeUploadPhotos] =
    useCloudinary(
      {
        url: CLOUDINARY_API,
        method: 'POST',
      },
      {manual: true},
    );
  const photoDropdownRef = useRef<DropdownRef>(null);

  const updateVehiclePhoto = (newPhotoUrl: string) => {
    const updatedVehiclePhotos = [...vehiclePhotos];
    updatedVehiclePhotos[currentPhotoIndex] = newPhotoUrl;
    setVehiclePhotos(updatedVehiclePhotos);
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

        updateVehiclePhoto(photo?.assets[0].base64!);
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

      updateVehiclePhoto(photo?.assets[0].base64!);
    } catch (error) {
      showNotification({
        title: 'Error',
        description: 'Ha ocurrido un error inesperado.',
      });
    }
  };

  const openPhotoDropdown = (index: PhotoIndex) => {
    photoDropdownRef.current?.open();
    setCurrentPhotoIndex(index);
  };

  const closePhotoDropdown = () => {
    photoDropdownRef.current?.close();
  };

  const handleShowNotification = (message: string) => {
    showNotification({
      title: 'Yuju',
      description: message,
    });
  };

  const isValidPhoto = (photo: string) => {
    return typeof photo === 'string' && !URL_REGEX.test(photo);
  };

  return {
    isValidPhoto,
    handleSubmit,
    vehiclePhotos,
    executeUpdateVehicle,
    mutateMyVehicle,
    handleShowNotification,
    openPhotoDropdown,
    closePhotoDropdown,
    formState,
    photoDropdownRef,
    isLoading:
      myVehicleIsLoading ||
      myVehicleIsValidating ||
      updateVehicleIsLoading ||
      uploadPhotosIsLoading,
    hasUnsavedChanges,
    control,
    takePhoto,
    pickPhotoFromGallery,
    randomPlate,
    executeUploadPhotos,
    buildBase64,
  };
};

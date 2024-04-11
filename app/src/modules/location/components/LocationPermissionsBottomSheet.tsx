import React, {useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import {Text, Box, Button} from '@yuju/modules/ui';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {locationPermissionsBottomSheetRef} from '../refs';
import {usePermissionsStore} from '../stores/usePermissionsStore';
import {useCleanInstall} from '@yuju/shared/storage/hooks/useCleanInstall';
import {wait} from '@yuju/shared/helpers/wait';
import {useTimeout} from '@yuju/shared/hooks/useTimeout';

export const LocationPermissionsBottomSheet: React.FC = () => {
  const {hasCleanInstall} = useCleanInstall();
  const locationStatus = usePermissionsStore(s => s.locationStatus);
  const askLocationPermission = usePermissionsStore(
    s => s.askLocationPermission,
  );
  const dontShowBottomSheet =
    locationStatus === 'granted' ||
    locationStatus === 'unavailable' ||
    hasCleanInstall;

  useTimeout(
    () => {
      locationPermissionsBottomSheetRef.current?.expand();
    },
    dontShowBottomSheet ? null : 5000,
  );

  const handleAskLocationPermission = async () => {
    try {
      locationPermissionsBottomSheetRef.current?.close();
      await wait(500);
      await askLocationPermission();
    } catch (error) {
      console.log('handleAskLocationPermission error', error);
    }
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  if (dontShowBottomSheet) {
    return null;
  }

  return (
    <BottomSheet
      ref={locationPermissionsBottomSheetRef}
      index={-1}
      backdropComponent={renderBackdrop}
      snapPoints={['50%']}
      backgroundStyle={{
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}>
      <Box flex={1} p="xl">
        <Box flex={1}>
          {/** Icono que tenga que ver con localización */}
          <Box w={50} h={50} bg="blue500" rounded="full" />

          <Text fontSize="4xl" mt="md" fontWeight="600">
            Localización
          </Text>

          <Text fontSize="lg" mt="md" color="neutral600">
            Al permitir la localización,{' '}
            <Text fontSize="lg" fontWeight="600" color="blue500">
              Rentit
            </Text>{' '}
            podrá darte un mejor servicio.
          </Text>
        </Box>

        <Box style={{gap: 20}}>
          {locationStatus === 'blocked' ? (
            <Text fontSize="md" fontWeight="300" color="red500">
              Al parecer tienes bloqueada la localización en los permisos de la
              aplicación, por favor presiona el botón de arriba para ir a
              configuración.
            </Text>
          ) : null}

          <Button
            block
            bg="blue500"
            rounded="2xl"
            fontWeight="500"
            onPress={handleAskLocationPermission}>
            {locationStatus === 'blocked'
              ? 'Ir a la Configuración'
              : 'Habilitar'}
          </Button>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{alignSelf: 'center'}}
            onPress={() => {
              locationPermissionsBottomSheetRef.current?.close();
            }}>
            <Text fontSize="xs" color="neutral500">
              Lo haré más tarde
            </Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </BottomSheet>
  );
};

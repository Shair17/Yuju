import React from 'react';
import {StatusBar} from '@yuju/components/atoms/StatusBar';
import {Div, Text, Image, Button} from 'react-native-magnus';
import {usePermissionsStore} from '@yuju/global-stores/usePermissionsStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';

const geolocationImage = require('@yuju/assets/images/geolocation-bg.png');

interface Props
  extends NativeStackScreenProps<
    RootStackParams,
    'GeolocationPermissionsScreen'
  > {}

export const GeolocationPermissionsScreen: React.FC<Props> = () => {
  const locationStatus = usePermissionsStore(s => s.locationStatus);
  const askLocationPermission = usePermissionsStore(
    s => s.askLocationPermission,
  );

  return (
    <Div flex={1} bg="body">
      <StatusBar translucent={false} />
      <Div flex={3}>
        <Image source={geolocationImage} flex={1} resizeMode="contain" />
      </Div>
      <Div flex={3}>
        <Div flex={3} px="2xl" alignItems="center">
          <Text fontSize="6xl" fontWeight="bold" color="text">
            Geolocalización
          </Text>

          <Div my="md" />

          <Text fontSize="lg" textAlign="center" color="textPrimary">
            Al permitir la geolocalización,{' '}
            <Text
              fontSize="lg"
              textAlign="center"
              color="textPrimary"
              fontWeight="600">
              Yuju
            </Text>{' '}
            podrá brindarte un mejor servicio.
          </Text>
        </Div>
        <Div flex={3} px="2xl">
          <Button
            block
            shadow="xs"
            fontWeight="bold"
            rounded="lg"
            fontSize="3xl"
            onPress={askLocationPermission}>
            {locationStatus === 'blocked'
              ? 'Ir a la Configuración'
              : 'Habilitar'}
          </Button>

          <Div my="lg" />

          {locationStatus === 'blocked' ? (
            <Text color="textPrimary" fontSize="sm" fontWeight="300">
              Al parecer tienes bloqueada la geolocalización en los permisos de
              la aplicación, por favor presiona el botón de arriba para ir a
              configuración.
            </Text>
          ) : null}
        </Div>
      </Div>
    </Div>
  );
};

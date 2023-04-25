import React from 'react';
import {Icon, Button} from 'react-native-magnus';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';
import {Alert} from 'react-native';
import {showAlert} from '@yuju/common/utils/notification';

export const LogoutButton: React.FC = () => {
  const removeTokens = useAuthStore(s => s.removeTokens);
  const logOutFromYuju = useAuthStore(s => s.logOutFromYuju);

  const logout = () => {
    // TODO: validar si el driver está en una carrera
    // showAlert({
    //   title: 'Advertencia',
    //   description: 'No puedes cerrar sesión cuando estás en una carrera.',
    //   alertType: 'warn',
    // });

    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: async () => {
            await logOutFromYuju();
            removeTokens();
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <Button
      block
      px="xl"
      py="lg"
      bg="red50"
      underlayColor="red100"
      fontSize="lg"
      color="red500"
      fontWeight="bold"
      onPress={logout}
      rounded="lg"
      prefix={
        <Icon
          fontSize="2xl"
          fontFamily="Ionicons"
          name="log-out-outline"
          color="red500"
          mr="md"
        />
      }>
      Cerrar sesión
    </Button>
  );
};

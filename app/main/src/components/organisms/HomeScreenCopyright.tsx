import {goToShairIG} from '@yuju/common/utils/link';
import React from 'react';
import {Div, Text} from 'react-native-magnus';

export const HomeScreenCopyright = () => {
  return (
    <Div mt="3xl">
      <Text textAlign="center" fontSize="sm" color="gray500">
        © {new Date().getFullYear().toString()} Yuju · Desarrollado por{' '}
        <Text
          onPress={goToShairIG}
          fontSize="sm"
          color="gray500"
          fontWeight="500">
          @shair.dev
        </Text>{' '}
        · Todos los derechos reservados.
      </Text>
    </Div>
  );
};

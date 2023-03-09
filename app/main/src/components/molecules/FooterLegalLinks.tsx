import React, {FC} from 'react';
import {TouchableOpacity} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import {openLink} from '@yuju/common/utils/link';

interface Props {}

export const FooterLegalLinks: FC<Props> = () => {
  return (
    <Div flexDir="row" flexWrap="wrap">
      <Text fontSize="xs" color="gray400" fontWeight="500">
        Al iniciar sesión, aceptas nuestra{' '}
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => openLink('https://fastly.vercel.app/privacidad')}>
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray600"
          borderBottomWidth={1}
          borderBottomColor="gray600">
          Política de Privacidad
        </Text>
      </TouchableOpacity>
      <Text fontSize="xs" color="gray400" fontWeight="500">
        {' '}
        y{' '}
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => openLink('https://fastly.vercel.app/terminos')}>
        <Text
          fontSize="xs"
          fontWeight="600"
          color="gray600"
          borderBottomWidth={1}
          borderBottomColor="gray600">
          Términos de Uso
        </Text>
      </TouchableOpacity>
      <Text fontSize="xs" color="gray400" fontWeight="500">
        .
      </Text>
    </Div>
  );
};

import React from 'react';
import {Button, Div, Text} from 'react-native-magnus';

interface Props {
  onButtonPress: () => void;
}

export const GPSAccessDenied: React.FC<Props> = ({onButtonPress}) => {
  return (
    <Div flex={1} bg="body" justifyContent="center" alignItems="center">
      <Text fontSize="lg" fontWeight="600" textAlign="center">
        Por favor activa el GPS en tu teléfono
      </Text>
      <Button
        mt="lg"
        rounded="lg"
        onPress={onButtonPress}
        alignSelf="center"
        fontWeight="bold">
        Reintentar
      </Button>
    </Div>
  );
};

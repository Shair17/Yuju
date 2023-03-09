import React, {FC} from 'react';
import {Div, Overlay, Text} from 'react-native-magnus';
import {ActivityIndicator} from '../atoms/ActivityIndicator';

interface Props {
  overlayVisible: boolean;
  text?: string;
}

export const OverlayLoading: FC<Props> = ({
  overlayVisible,
  text = 'Cargando...',
}) => {
  return (
    <Overlay
      rounded="lg"
      visible={overlayVisible}
      justifyContent="center"
      alignItems="center"
      p="xl">
      <ActivityIndicator />
      <Text mt="md" color="text" textAlign="center">
        {text}
      </Text>
    </Overlay>
  );
};

import React from 'react';
import {Button, Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';
import {useDimensions} from '@yuju/global-hooks/useDimensions';
import {useIsConnected} from '@yuju/global-hooks/useIsConnected';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {useShouldUpdate} from '@yuju/global-hooks/useShouldUpdate';

const astronautIllustration = require('@yuju/assets/images/astronaut.png');

interface Props
  extends NativeStackScreenProps<RootStackParams, 'ConnectionErrorScreen'> {}

export const ConnectionErrorScreen: React.FC<Props> = ({navigation}) => {
  const {
    window: {width},
  } = useDimensions();
  const appSouldUpdate = useShouldUpdate();
  const socketStatus = useSocketStore(s => s.status);
  const isConnected = useIsConnected();
  const title: string =
    isConnected === 'disconnected'
      ? 'Por favor, verifica tu conexión a internet'
      : socketStatus === 'offline'
      ? 'Yuju está en mantenimiento, vuelve en unos minutos por favor.'
      : appSouldUpdate === 'error'
      ? 'Oops, tenemos problemas, vuelve en unos minutos por favor.'
      : 'Ha ocurrido algo inesperado, vuelve en unos minutos por favor.';

  /**
   * No Internet -> 'Por favor, verifica tu conexión a internet'
   * Socket Is Not Online -> 'Yuju está en mantenimiento, vuelve en unos minutos por favor.'
   * appSouldUpdate==='error' -> 'Oops, tenemos problemas, vuelve en unos minutos por favor.'
   * else -> 'Ha ocurrido algo inesperado, vuelve en unos minutos por favor.'
   */

  const goToMinigame = () => {
    navigation.navigate('MinigameScreen');
  };

  return (
    <Div flex={1} bg="body">
      <Div flex={2}>
        <Div p="2xl">
          <Text fontSize="6xl" fontWeight="bold" color="text">
            {title}
          </Text>
        </Div>
      </Div>
      <Div flex={2} p="2xl">
        <Button
          block
          fontWeight="bold"
          fontSize="3xl"
          rounded="lg"
          onPress={goToMinigame}>
          Jugar
        </Button>
      </Div>
      <Div flex={2} justifyContent="flex-end" px="2xl" alignItems="center">
        <Div w={width} h={380} bgImg={astronautIllustration} mb="xl" />
      </Div>
    </Div>
  );
};

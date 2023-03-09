import React from 'react';
import {Vibration, StatusBar} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Div, Text, Button} from 'react-native-magnus';
import {DevelopedByShair} from '@yuju/components/atoms/DevelopedByShair';
import {RootStackParams} from '../Root';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'OnBoardingScreen'> {}

export const OnBoardingScreen: React.FC<Props> = ({navigation}) => {
  const goToAuthScreen = () => {
    Vibration.vibrate(30);
    navigation.replace('AuthenticationScreen');
  };

  return (
    <Div flex={1} bg="body">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Div
        flex={1}
        alignItems="center"
        justifyContent="center"
        alignSelf="center">
        <Text>AQUÍ DEBE IR UNA ILUSTRACIÓN DE UNA BAJAJ O ALGO ASÍ...</Text>
      </Div>
      <Div flex={1} alignItems="center" justifyContent="center" px="2xl">
        <Text fontWeight="700" fontSize="6xl" textAlign="center" mb="md">
          Una mejor forma de{' '}
          <Text textAlign="center" fontSize="6xl" color="#0e153a">
            transportarse
          </Text>
        </Text>
        <Text textAlign="center" fontSize="lg" w="90%" mb="2xl">
          Seguridad, confianza y rápidez en un solo lugar, con{' '}
          <Text fontSize="lg" fontWeight="600" color="#0e153a">
            Yuju
          </Text>
          .
        </Text>
        <Button
          justifyContent="center"
          alignItems="center"
          alignSelf="center"
          fontSize="2xl"
          fontWeight="bold"
          bg="#000"
          rounded="circle"
          block
          h={50}
          onPress={goToAuthScreen}>
          Empezar
        </Button>
      </Div>

      <DevelopedByShair />
    </Div>
  );
};

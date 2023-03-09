import React from 'react';
import {StatusBar} from 'react-native';
import {Div, Text, Button} from 'react-native-magnus';
import * as Animatable from 'react-native-animatable';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {GetMyProfile} from '@yuju/types/app';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'WelcomeNewUserScreen'> {}

export const WelcomeNewUserScreen: React.FC<Props> = ({navigation, route}) => {
  const {data, isLoading} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });
  const firstName = data?.user.profile.name.split(' ')[0] ?? 'usuario';

  const handleContinue = () => {
    navigation.replace('AskReferralCodeScreen');
  };

  return (
    <ScrollScreen>
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <Animatable.View animation="fadeIn" delay={500} useNativeDriver>
          <Text fontWeight="bold" fontSize="5xl" color="text">
            Hola{' '}
            <Text fontWeight="bold" fontSize="5xl" color="secondary">
              {firstName}
            </Text>
            , gracias por descargar{' '}
            <Text
              fontWeight="bold"
              fontSize="5xl"
              bg="primary500"
              color="white">
              {' '}
              Yuju{' '}
            </Text>
          </Text>
        </Animatable.View>

        <Div my="md" />

        <Animatable.View animation="fadeIn" delay={800} useNativeDriver>
          <Text fontWeight="bold" fontSize="5xl" color="text">
            Parece que eres nuevo por aquí.
          </Text>
        </Animatable.View>

        <Div my="md" />

        <Animatable.View animation="fadeIn" delay={1100} useNativeDriver>
          <Text fontWeight="bold" fontSize="5xl" color="text">
            A continuación, configurarás tu perfil.
          </Text>
        </Animatable.View>

        <Div my="md" />

        <Animatable.View animation="fadeIn" delay={1400} useNativeDriver>
          <Text fontWeight="bold" fontSize="5xl" color="text">
            Por favor llénalo con información verídica para brindarte un mejor
            servicio.
          </Text>
        </Animatable.View>

        <Div my="lg" />

        <Animatable.View animation="bounceIn" delay={1700} useNativeDriver>
          <Button
            block
            fontWeight="bold"
            rounded="lg"
            fontSize="3xl"
            loading={isLoading}
            onPress={handleContinue}>
            Continuar
          </Button>
        </Animatable.View>
      </Div>
    </ScrollScreen>
  );
};

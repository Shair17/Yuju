import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {Div, Text, Button} from 'react-native-magnus';
import {DevelopedByShair} from '@yuju/components/atoms/DevelopedByShair';
import {useVibration} from '@yuju/global-hooks/useVibration';
import {useAppVersion} from '../../global-hooks/useAppVersion';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {useShouldUpdate} from '@yuju/global-hooks/useShouldUpdate';
import {LoadingTemplate} from '@yuju/components/templates/LoadingTemplate';
import {AppVersionResponse} from '@yuju/types/app';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'UpdateAppScreen'> {}

export const UpdateAppScreen: React.FC<Props> = ({navigation}) => {
  useVibration(1000);

  const appVersion = useAppVersion();
  const {data, isLoading, isError} = useRequest<AppVersionResponse>({
    method: 'GET',
    url: '/',
  });
  const appShouldUpdate = useShouldUpdate();

  const goToUpdateApp = () => {
    console.log('launch app store or play store');
  };

  useEffect(() => {
    const canGoBack = navigation.canGoBack();
    const appIsUpdated = appShouldUpdate === 'needs-update';

    if (canGoBack && appIsUpdated) {
      navigation.goBack();
    }
  }, [navigation, appShouldUpdate]);

  if (isLoading || !data) {
    return <LoadingTemplate />;
  }

  if (isError) {
    return (
      <Div>
        <Text>Error</Text>
      </Div>
    );
  }

  return (
    <Div flex={1} bg="body">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <Div
        flex={1}
        alignItems="center"
        justifyContent="center"
        alignSelf="center">
        <Text>AQUÍ DEBE IR UNA ILUSTRACIÓN...</Text>
      </Div>
      <Div flex={1} alignItems="center" justifyContent="center" px="2xl">
        <Text fontWeight="700" fontSize="6xl" textAlign="center" mb="md">
          Hemos mejorado{' '}
          <Text textAlign="center" fontSize="6xl" color="#0e153a">
            Yuju!
          </Text>
        </Text>
        <Text textAlign="center" fontSize="lg" w="90%" mb="2xl">
          Estás usando la versión{' '}
          <Text fontSize="lg" fontWeight="600" color="#0e153a">
            {appVersion}
          </Text>
          , actualiza a la nueva versión{' '}
          <Text fontSize="lg" fontWeight="600" color="#0e153a">
            {data.app_version}
          </Text>{' '}
          para tener acceso a todas las mejoras.
        </Text>
        <Button
          justifyContent="center"
          alignItems="center"
          alignSelf="center"
          fontSize="2xl"
          fontWeight="bold"
          bg="primary500"
          rounded="circle"
          block
          h={50}
          onPress={goToUpdateApp}>
          Actualizar
        </Button>
      </Div>

      <DevelopedByShair />
    </Div>
  );
};

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {Button, Div, Icon, Input, Text} from 'react-native-magnus';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {Controller} from 'react-hook-form';
import {useBugReport} from '@yuju/global-hooks/useBugReport';
import {RootDrawerParams} from '../drawer/Root';
import {showNotification} from '@yuju/common/utils/notification';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {useLocation} from '@yuju/global-hooks/useLocation';

interface Props
  extends DrawerScreenProps<RootDrawerParams, 'ReportBugScreen'> {}

export const ReportBugScreen: React.FC<Props> = ({navigation}) => {
  const {
    bugReportIsLoading,
    control,
    executeCreateBugReport,
    formState,
    handleSubmit,
    clearErrors,
    reset,
  } = useBugReport();
  const socket = useSocketStore(s => s.socket);
  const {userLocation} = useLocation();
  const shouldGoToRequestScreen = false;

  const handleSubmitBug = handleSubmit(data => {
    executeCreateBugReport({
      data: {
        title: data.title,
        description: data.description,
        extra: data.extra,
      },
    }).then(response => {
      if (response.data.created) {
        showNotification({
          title: 'Reportes',
          description:
            'Tu reporte ha sido enviado, gracias por ayudar a mejorar Yuju.',
        });
      }

      clearErrors();
      reset();
      navigation.navigate('ReportsActivityScreen');
    });
  });

  useEffect(() => {
    if (!shouldGoToRequestScreen) return;

    navigation.jumpTo('HomeStackScreen');
  }, [shouldGoToRequestScreen, navigation]);

  useEffect(() => {
    socket?.emit('DRIVER_LOCATION', userLocation);

    return () => {
      socket?.off('DRIVER_LOCATION');
    };
  }, [socket, userLocation]);

  return (
    <ScrollScreen>
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        {/** Heading Text {title, subtitle} */}
        <Div>
          <Text fontWeight="bold" color="text" fontSize="5xl">
            Reportar un problema y ayuda a mejorar Yuju!
          </Text>
          <Text mt="md" fontSize="lg" color="gray700">
            Lamentamos que hayas tenido una mala experiencia en nuestra
            aplicación, queremos mejorar y agradecemos mucho tu ayuda.
          </Text>
        </Div>

        <Div my="md" />

        {/** Inputs */}

        {/** Title */}
        <Div mt="lg">
          <Text fontWeight="500" color="gray500">
            Título
          </Text>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                autoFocus
                mt="md"
                placeholder="Ingresa un título"
                keyboardType="default"
                fontSize="lg"
                rounded="lg"
                focusBorderColor="primary700"
                fontWeight="500"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                borderColor={formState.errors.title ? 'red' : 'gray400'}
                prefix={<Icon fontFamily="Ionicons" name="flag" mr="xs" />}
              />
            )}
            name="title"
          />
          {formState.errors.title && (
            <Text color="red" mt={2} fontWeight="500">
              El título es requerido, ejemplo: Problema al solicitar un mototaxi
            </Text>
          )}
        </Div>

        {/** Description */}
        <Div mt="lg">
          <Text fontWeight="500" color="gray500">
            Descripción
          </Text>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                mt="md"
                placeholder="Ingresa una descripción"
                keyboardType="default"
                fontSize="lg"
                rounded="lg"
                focusBorderColor="primary700"
                fontWeight="500"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                borderColor={formState.errors.description ? 'red' : 'gray400'}
                textAlignVertical="top"
                // prefix={<Icon fontFamily="Ionicons" name="document" mr="xs" />}
                numberOfLines={3}
                multiline
                maxLength={200}
              />
            )}
            name="description"
          />
          {formState.errors.description && (
            <Text color="red" mt={2} fontWeight="500">
              La descripción es requerida.
            </Text>
          )}
        </Div>

        {/** Description */}
        <Div mt="lg">
          <Text fontWeight="500" color="gray500">
            Información extra
          </Text>

          <Controller
            control={control}
            rules={{
              required: false,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                mt="md"
                placeholder="Ingresa información extra"
                keyboardType="default"
                fontSize="lg"
                rounded="lg"
                focusBorderColor="primary700"
                fontWeight="500"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                borderColor={formState.errors.extra ? 'red' : 'gray400'}
                prefix={
                  <Icon
                    fontFamily="Ionicons"
                    name="ellipsis-vertical"
                    mr="xs"
                  />
                }
              />
            )}
            name="extra"
          />
          {formState.errors.extra && (
            <Text color="red" mt={2} fontWeight="500">
              La información extra es inválida.
            </Text>
          )}
        </Div>

        <Div my="lg" />

        <Text mt="md" color="gray700">
          Revisaremos cada reporte que nos enviés, recuerda ser específico con
          tus reportes.
        </Text>

        <Div my="lg" />

        <Div mt="lg">
          <Button
            bg="primary500"
            rounded="lg"
            block
            fontWeight="bold"
            h={55}
            loading={bugReportIsLoading}
            fontSize="3xl"
            onPress={handleSubmitBug}>
            Enviar
          </Button>
        </Div>
      </Div>
    </ScrollScreen>
  );
};

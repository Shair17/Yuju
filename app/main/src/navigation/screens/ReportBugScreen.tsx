import React from 'react';
import {StatusBar} from 'react-native';
import {Button, Div, Icon, Input, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import useAxios from 'axios-hooks';
import {zodResolver} from '@hookform/resolvers/zod';
import {CreateBugReportBody, CreateBugReportResponse} from '@yuju/types/app';
import {Notifier} from 'react-native-notifier';

export const schemaValidator = z.object({
  title: z.string(),
  description: z.string(),
  extra: z.optional(z.string()),
});

type FormDataValues = {
  title: string;
  description: string;
  extra?: string;
};

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'ReportBugScreen'> {}

export const ReportBugScreen: React.FC<Props> = ({navigation}) => {
  const [{loading}, executeCreateBugReport] = useAxios<
    CreateBugReportResponse,
    CreateBugReportBody
  >(
    {
      method: 'POST',
      url: '/bug-reports/users',
    },
    {manual: true},
  );
  const {control, handleSubmit, formState} = useForm<FormDataValues>({
    resolver: zodResolver(schemaValidator),
  });

  const handleSubmitBug = handleSubmit(data => {
    executeCreateBugReport({
      data: {
        title: data.title,
        description: data.description,
        extra: data.extra,
      },
    })
      .then(response => {
        if (response.data.created) {
          Notifier.showNotification({
            title: 'Reportes',
            description:
              'Tu reporte ha sido enviado, gracias por ayudar a mejorar Yuju.',
          });
        }

        navigation.goBack();
      })
      .catch(console.log);
  });

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
                prefix={<Icon fontFamily="Ionicons" name="document" mr="xs" />}
                multiline={true}
                numberOfLines={3}
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
              required: true,
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
            loading={loading}
            fontSize="3xl"
            onPress={handleSubmitBug}>
            Enviar
          </Button>
        </Div>
      </Div>
    </ScrollScreen>
  );
};

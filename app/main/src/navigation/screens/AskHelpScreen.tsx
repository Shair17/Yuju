import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {ProfileStackParams} from '../bottom-tabs/ProfileStackScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {useGreeting} from '@yuju/global-hooks/useGreeting';
import {GetMyProfile} from '@yuju/types/app';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {openLink} from '@yuju/common/utils/link';
import {AskHelpScreenContactItem} from '@yuju/components/molecules/AskHelpScreenContactItem';
import {useClipboard} from '@react-native-clipboard/clipboard';
import {
  SHAIR_WEB,
  YUJU_SUPPORT_EMAIL,
  SHAIR_CONTACTO,
  SHAIR_EMAIL,
  SHAIR_FACEBOOK,
  SHAIR_INSTAGRAM,
  SHAIR_WHATSAPP,
  YUJU_FACEBOOK,
  YUJU_INSTAGRAM,
  YUJU_WEB,
  YUJU_WHATSAPP,
} from '@yuju/common/constants/support';
import {Vibration, StatusBar} from 'react-native';
import {Notifier} from 'react-native-notifier';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'AskHelpScreen'> {}

export const AskHelpScreen: React.FC<Props> = () => {
  const {data: myProfile} = useRequest<GetMyProfile>({
    method: 'GET',
    url: '/users/me',
  });
  const greeting = useGreeting();
  const [_, setClipboard] = useClipboard();

  const handleCopyEmail = (email: string) => {
    setClipboard(email);

    Vibration.vibrate(15);

    Notifier.showNotification({
      title: 'Portapapeles',
      description: 'Tu dirección ha sido copiado al portapapeles.',
      hideOnPress: true,
    });
  };

  return (
    <ScrollScreen>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        <Div mt="md">
          <Text fontWeight="bold" fontSize="2xl" color="text" textAlign="left">
            {greeting}{' '}
            <Text fontWeight="bold" fontSize="2xl" color="primary500">
              {myProfile?.user.profile.name ?? 'usuario'}
            </Text>
            , estamos aquí para ayudarte.
          </Text>
        </Div>

        <Div mt="2xl">
          <Div mb="lg">
            <Text textAlign="left" fontWeight="600" fontSize="lg" mb="md">
              Redes Sociales de Yuju
            </Text>

            <AskHelpScreenContactItem
              iconName="logo-whatsapp"
              title="WhatsApp"
              description="+51 966107266"
              onPress={() => openLink(YUJU_WHATSAPP, false)}
            />

            <AskHelpScreenContactItem
              iconName="logo-facebook"
              title="Facebook"
              description="@yujuapp"
              onPress={() => openLink(YUJU_FACEBOOK, false)}
            />

            <AskHelpScreenContactItem
              iconName="logo-instagram"
              title="Instagram"
              description="@yuju.app"
              onPress={() => openLink(YUJU_INSTAGRAM, false)}
            />

            <AskHelpScreenContactItem
              iconName="earth"
              title="Web"
              description="https://fastly.delivery"
              onPress={() => openLink(YUJU_WEB, false)}
            />
          </Div>

          <Div mb="lg">
            <Text textAlign="left" fontWeight="600" fontSize="lg" mb="md">
              Redes Sociales del Desarrollador
            </Text>

            <AskHelpScreenContactItem
              iconName="logo-whatsapp"
              title="WhatsApp"
              description="+51 966107266"
              onPress={() => openLink(SHAIR_WHATSAPP, false)}
            />

            <AskHelpScreenContactItem
              iconName="logo-facebook"
              title="Facebook"
              description="@shair17"
              onPress={() => openLink(SHAIR_FACEBOOK, false)}
            />

            <AskHelpScreenContactItem
              iconName="logo-instagram"
              title="Instagram"
              description="@shair.dev"
              onPress={() => openLink(SHAIR_INSTAGRAM, false)}
            />

            <AskHelpScreenContactItem
              iconName="earth"
              title="Web"
              description="https://shair.dev"
              onPress={() => openLink(SHAIR_WEB, false)}
            />
          </Div>

          <Text>
            Si deseas ponerte en contacto con{' '}
            <Text fontWeight="bold" color="primary">
              Yuju
            </Text>{' '}
            mediante correo electrónico, considera escribirnos a{' '}
            <Text
              fontWeight="bold"
              color="secondary"
              onPress={() => handleCopyEmail(YUJU_SUPPORT_EMAIL)}>
              {YUJU_SUPPORT_EMAIL}
            </Text>
            .
          </Text>

          <Text mt="md">
            También puedes ponerte en contacto con el desarrollador de Yuju,{' '}
            <Text fontWeight="bold" color="primary">
              Shair
            </Text>
            , mediante correo electrónico, escribe a{' '}
            <Text
              fontWeight="bold"
              color="secondary"
              onPress={() => handleCopyEmail(SHAIR_EMAIL)}>
              {SHAIR_EMAIL}
            </Text>{' '}
            o accediendo a{' '}
            <Text
              fontWeight="bold"
              color="secondary"
              onPress={() => openLink(SHAIR_CONTACTO, false)}>
              su sitio web oficial
            </Text>
            .
          </Text>
        </Div>

        <Div my="xl" />
      </Div>
    </ScrollScreen>
  );
};
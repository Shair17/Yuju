import React, {Fragment} from 'react';
import {StatusBar} from 'react-native';
import {Div, Text, Button, Image, Icon} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FooterLegalLinks} from '@yuju/components/molecules/FooterLegalLinks';
import {OverlayLoading} from '@yuju/components/molecules/OverlayLoading';
import {DevelopedByShair} from '@yuju/components/atoms/DevelopedByShair';
import {RootStackParams} from '../Root';
import {useAuthentication} from '@yuju/mods/auth/hooks/useAuthentication';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'AuthenticationScreen'> {}

const authenticationBackgroundImage = require('@yuju/assets/images/svg-shape-8.png');

export const AuthenticationScreen: React.FC<Props> = () => {
  const {overlayVisible, loading, loginWithFacebook} = useAuthentication();

  return (
    <Fragment>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Div flex={1} bg="body">
        <Div flex={3}>
          <Div
            flex={1}
            bgImg={authenticationBackgroundImage}
            roundedBottomLeft={80}
            roundedBottomRight={80}>
            <Div flex={1} justifyContent="center" alignItems="center">
              <Div
                bg="red100"
                alignSelf="center"
                w={200}
                h={200}
                rounded="circle">
                <Image
                  w={150}
                  h={150}
                  flex={1}
                  alignSelf="center"
                  resizeMode="contain"
                  // source={logoImage}
                />
              </Div>
            </Div>
          </Div>
        </Div>
        <Div flex={2}>
          <Div px="2xl" mt="xl">
            <Text
              textAlign="center"
              color="#000"
              fontWeight="bold"
              fontSize="6xl">
              ¡Bienvenid@ a Yuju!
            </Text>

            <Div my="md" />

            <Button
              block
              bg="#1877F2"
              fontWeight="bold"
              fontSize="xl"
              rounded="circle"
              loading={loading}
              h={55}
              prefix={
                <Icon
                  fontFamily="MaterialCommunityIcons"
                  name="facebook"
                  rounded="circle"
                  color="white"
                  mr="sm"
                  fontSize="5xl"
                />
              }
              onPress={loginWithFacebook}>
              Continuar con Facebook
            </Button>

            <Div my="md" />

            <FooterLegalLinks />
          </Div>
        </Div>

        <DevelopedByShair />
      </Div>

      {overlayVisible ? (
        <OverlayLoading overlayVisible={overlayVisible && loading} />
      ) : null}
    </Fragment>
  );
};

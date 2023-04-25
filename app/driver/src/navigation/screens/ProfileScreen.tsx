import React, {useRef, useMemo, useCallback, useState, Fragment} from 'react';
import {StatusBar, TouchableOpacity, Vibration} from 'react-native';
import {Div, Text, Button, Avatar, Image, Icon} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParams} from '../stacks/ProfileStackScreen';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {useGreeting} from '@yuju/global-hooks/useGreeting';
import {GetMyProfile, GetMyVehicle} from '@yuju/types/app';
import {useRequest} from '@yuju/global-hooks/useRequest';
import * as Animatable from 'react-native-animatable';
import {showAlert} from '@yuju/common/utils/notification';
import {useIsActive} from '@yuju/global-hooks/useIsActive';
import {formatDate} from '@yuju/common/utils/format';
import {getAgeFromDate} from '@yuju/common/utils/age';
import BottomSheet from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';

interface Props
  extends NativeStackScreenProps<ProfileStackParams, 'ProfileScreen'> {}

export const ProfileScreen: React.FC<Props> = ({navigation}) => {
  const activateAccountBottomSheetRef = useRef<BottomSheet>(null);
  const activateAccountSnapPoints = useMemo(() => ['60%'], []);
  const {data: myProfile, isLoading: myProfileIsLoading} =
    useRequest<GetMyProfile>({
      method: 'GET',
      url: '/drivers/me',
    });
  const {data: myVehicle, isLoading: myVehicleIsLoading} =
    useRequest<GetMyVehicle>({
      method: 'GET',
      url: '/drivers/me/vehicle',
      params: {
        skipIsNewValidation: true,
      },
    });
  const {isActive} = useIsActive();
  const [
    activateAccountBottomSheetIsOpen,
    setActivateAccountBottomSheetIsOpen,
  ] = useState(!isActive);
  const greeting = useGreeting();

  const openBottomSheet = () => {
    activateAccountBottomSheetRef.current?.expand();
    setActivateAccountBottomSheetIsOpen(true);
  };

  const closeBottomSheet = () => {
    activateAccountBottomSheetRef.current?.close();
    setActivateAccountBottomSheetIsOpen(false);
  };

  const showBadgeNotificationMessage = () => {
    if (!isActive) {
      Vibration.vibrate(100);
    }

    showAlert({
      title: 'Yuju',
      description: isActive
        ? 'Felicidades, oficialmente eres parte de Yuju!'
        : 'Tu cuenta aún no ha sido activada, envía tus datos para activarla. Presiona en este mensaje para más información.',
      alertType: isActive ? 'success' : 'warn',
      duration: isActive ? 1000 : 8000,
      onPress() {
        if (isActive) return;

        Vibration.vibrate(50);

        openBottomSheet();
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      const timeoutId = setTimeout(() => {
        if (isActive) {
          closeBottomSheet();
        } else {
          openBottomSheet();
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }, [navigation, isActive]),
  );

  return (
    <Fragment>
      <ScrollScreen
        scrollViewProps={{
          pointerEvents: activateAccountBottomSheetIsOpen ? 'none' : 'auto',
        }}>
        <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
          {activateAccountBottomSheetIsOpen ? (
            <Div
              position="absolute"
              top={0}
              bottom={0}
              left={0}
              right={0}
              bg="rgba(0,0,0,0.5)"
              zIndex={1}
            />
          ) : null}

          <Div row justifyContent="space-between" alignItems="center">
            <Div position="relative">
              <Avatar
                source={{uri: myProfile?.driver.profile.avatar}}
                rounded="circle"
                bg="gray100"
                size={85}
              />

              <Div zIndex={10} position="absolute" bottom={0} right={0}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={showBadgeNotificationMessage}>
                  <Animatable.View
                    iterationCount="infinite"
                    animation="pulse"
                    easing="ease-in-out">
                    <Image
                      alignSelf="center"
                      w={30}
                      h={30}
                      source={
                        isActive
                          ? require('@yuju/assets/images/verification-badge-96.png')
                          : require('@yuju/assets/images/icons8-error-96.png')
                      }
                    />
                  </Animatable.View>
                </TouchableOpacity>
              </Div>
            </Div>

            <Div justifyContent="center">
              <Text fontSize="6xl" fontWeight="300" numberOfLines={1}>
                {greeting}
              </Text>

              <Text fontSize="4xl" fontWeight="700" numberOfLines={1}>
                {myProfile?.driver.profile.name}
              </Text>
            </Div>
          </Div>

          <Text mt="xl" fontWeight="500" color="gray500">
            Mi Perfil
          </Text>

          <Div
            mt="xs"
            rounded="lg"
            p="lg"
            borderWidth={1}
            borderColor="gray200">
            <Div row>
              <Icon
                fontSize="xl"
                mr="md"
                color="#333"
                fontFamily="Ionicons"
                name="phone-portrait-outline"
              />
              <Text fontSize="xl" fontWeight="500" color="gray600">
                {myProfile?.driver.profile.phoneNumber}
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                fontSize="xl"
                mr="md"
                color="#333"
                fontFamily="Ionicons"
                name="mail-outline"
              />

              <Text fontSize="xl" fontWeight="500" color="gray600">
                {myProfile?.driver.profile.email}
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                fontSize="xl"
                mr="md"
                color="#333"
                fontFamily="Ionicons"
                name="person-outline"
              />

              <Text fontSize="xl" fontWeight="500" color="gray600">
                {myProfile?.driver.profile.dni}
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                mr="md"
                fontSize="xl"
                color="#333"
                fontFamily="MaterialCommunityIcons"
                name="cake"
              />

              <Text fontSize="xl" fontWeight="500" color="gray600">
                {getAgeFromDate(new Date(myProfile?.driver.profile.birthDate!))}{' '}
                años
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                alignSelf="flex-start"
                mr="md"
                fontSize="xl"
                color="#333"
                fontFamily="MaterialCommunityIcons"
                name="card-text-outline"
              />

              <Text
                color="gray600"
                fontSize="xl"
                fontWeight="500"
                flex={1}
                style={{flexWrap: 'wrap'}}>
                {myProfile?.driver.summary}
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                mr="md"
                fontSize="xl"
                color="#333"
                fontFamily="Ionicons"
                name="time-outline"
              />
              <Text fontSize="xl" fontWeight="600" color="gray600">
                {formatDate(new Date(myProfile?.driver.createdAt!))}.
              </Text>
            </Div>
            <Button
              mt="lg"
              bg="primary50"
              underlayColor="primary100"
              color="primary500"
              rounded="lg"
              block
              fontWeight="bold"
              fontSize="xl"
              onPress={() => {
                navigation.navigate('EditProfileScreen');
              }}>
              Editar Perfil
            </Button>
          </Div>

          <Text mt="xl" fontWeight="500" color="gray500">
            Mi Mototaxi
          </Text>

          <Div
            mt="xs"
            rounded="lg"
            p="lg"
            borderWidth={1}
            borderColor="gray200">
            <Div row>
              <Icon
                fontSize="xl"
                mr="md"
                name="credit-card"
                fontFamily="MaterialCommunityIcons"
                color="#333"
              />

              <Text
                fontSize="xl"
                fontWeight="500"
                color="gray600"
                flex={1}
                style={{flexWrap: 'wrap'}}>
                {myVehicle?.plate}
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                fontSize="xl"
                mr="md"
                color={myVehicle?.licenseVerified ? 'green500' : 'red500'}
                name={
                  myVehicle?.licenseVerified
                    ? 'checkmark-circle'
                    : 'close-circle'
                }
                fontFamily="Ionicons"
              />
              <Text
                fontSize="xl"
                fontWeight="500"
                color="gray600"
                flex={1}
                style={{flexWrap: 'wrap'}}>
                {myVehicle?.licenseVerified
                  ? 'Tu licencia está verificada'
                  : 'Tu licencia no está verificada'}
                .
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                fontSize="xl"
                mr="md"
                color={myVehicle?.propertyCardVerified ? 'green500' : 'red500'}
                name={
                  myVehicle?.propertyCardVerified
                    ? 'checkmark-circle'
                    : 'close-circle'
                }
                fontFamily="Ionicons"
              />

              <Text
                fontSize="xl"
                fontWeight="500"
                color="gray600"
                flex={1}
                style={{flexWrap: 'wrap'}}>
                {myVehicle?.propertyCardVerified
                  ? 'Tu tarjeta de propiedad está verificada'
                  : 'Tu tarjeta de propiedad no está verificada'}
                .
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                fontSize="xl"
                mr="md"
                color={
                  myVehicle?.circulationCardVerified ? 'green500' : 'red500'
                }
                name={
                  myVehicle?.circulationCardVerified
                    ? 'checkmark-circle'
                    : 'close-circle'
                }
                fontFamily="Ionicons"
              />

              <Text
                fontSize="xl"
                fontWeight="500"
                color="gray600"
                flex={1}
                style={{flexWrap: 'wrap'}}>
                {myVehicle?.circulationCardVerified
                  ? 'Tu tarjeta de circulación está verificada'
                  : 'Tu tarjeta de circulación no está verificada'}
                .
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                fontSize="xl"
                mr="md"
                color={
                  myVehicle?.technicalReviewVerified ? 'green500' : 'red500'
                }
                name={
                  myVehicle?.technicalReviewVerified
                    ? 'checkmark-circle'
                    : 'close-circle'
                }
                fontFamily="Ionicons"
              />

              <Text
                fontSize="xl"
                fontWeight="500"
                color="gray600"
                flex={1}
                style={{flexWrap: 'wrap'}}>
                {myVehicle?.technicalReviewVerified
                  ? 'Tu revisión técnica está verificada'
                  : 'Tu revisión técnica no está verificada'}
                .
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                fontSize="xl"
                mr="md"
                color={myVehicle?.soatVerified ? 'green500' : 'red500'}
                name={
                  myVehicle?.soatVerified ? 'checkmark-circle' : 'close-circle'
                }
                fontFamily="Ionicons"
              />

              <Text
                color="gray600"
                fontSize="xl"
                fontWeight="500"
                flex={1}
                style={{flexWrap: 'wrap'}}>
                {myVehicle?.soatVerified
                  ? 'Tu SOAT está verificado'
                  : 'Tu SOAT no está verificado'}
                .
              </Text>
            </Div>

            <Div row mt="md">
              <Icon
                fontSize="xl"
                mr="md"
                color={myVehicle?.dniVerified ? 'green500' : 'red500'}
                name={
                  myVehicle?.dniVerified ? 'checkmark-circle' : 'close-circle'
                }
                fontFamily="Ionicons"
              />
              <Text
                color="gray600"
                fontSize="xl"
                fontWeight="500"
                flex={1}
                style={{flexWrap: 'wrap'}}>
                {myVehicle?.dniVerified
                  ? 'Tu DNI está verificado'
                  : 'Tu DNI no está verificado'}
                .
              </Text>
            </Div>

            <Button
              mt="lg"
              bg="secondary50"
              underlayColor="secondary100"
              color="secondary500"
              rounded="lg"
              block
              fontWeight="bold"
              fontSize="xl"
              onPress={() => {
                navigation.navigate('EditVehicleScreen');
              }}>
              Editar Vehículo
            </Button>
          </Div>
        </Div>
      </ScrollScreen>

      <BottomSheet
        index={isActive ? -1 : 0}
        ref={activateAccountBottomSheetRef}
        snapPoints={activateAccountSnapPoints}
        enablePanDownToClose
        onClose={() => {
          setActivateAccountBottomSheetIsOpen(false);
        }}>
        <Div flex={1} px="2xl" py="lg">
          <Text fontSize="6xl" fontWeight="bold">
            Tu cuenta aún no está activada
          </Text>
          <Text fontSize="sm" color="gray500">
            Es extremadamente necesario que tengas tu cuenta activada para
            empezar a trabajar con Yuju.
          </Text>

          <Div mt="lg">
            <Text fontSize="xs" color="gray500" fontWeight="500">
              Tienes que envíar todos los documentos que se muestran aquí.
            </Text>
            <Div row mt="xs">
              <Div
                flex={1}
                alignItems="center"
                justifyContent="center"
                p="md"
                bg={myVehicle?.circulationCardVerified ? 'primary50' : 'red50'}
                rounded="lg"
                mr="xs">
                <Text
                  fontSize="lg"
                  color={
                    myVehicle?.circulationCardVerified ? 'primary500' : 'red500'
                  }
                  fontWeight="bold"
                  textAlign="center">
                  Tarjeta de Circulación
                </Text>
              </Div>
              <Div
                flex={1}
                alignItems="center"
                justifyContent="center"
                p="md"
                bg={myVehicle?.dniVerified ? 'primary50' : 'red50'}
                rounded="lg"
                mx="xs">
                <Text
                  fontSize="lg"
                  color={myVehicle?.dniVerified ? 'primary500' : 'red500'}
                  fontWeight="bold"
                  textAlign="center">
                  DNI
                </Text>
              </Div>
              <Div
                flex={1}
                alignItems="center"
                justifyContent="center"
                p="md"
                bg={myVehicle?.licenseVerified ? 'primary50' : 'red50'}
                rounded="lg"
                ml="xs">
                <Text
                  fontSize="lg"
                  color={myVehicle?.licenseVerified ? 'primary500' : 'red500'}
                  fontWeight="bold"
                  textAlign="center">
                  Licencia
                </Text>
              </Div>
            </Div>
            <Div row mt="md">
              <Div
                flex={1}
                alignItems="center"
                justifyContent="center"
                p="md"
                bg={myVehicle?.propertyCardVerified ? 'primary50' : 'red50'}
                rounded="lg"
                mr="xs">
                <Text
                  fontSize="lg"
                  color={
                    myVehicle?.propertyCardVerified ? 'primary500' : 'red500'
                  }
                  fontWeight="bold"
                  textAlign="center">
                  Tarjeta de Propiedad
                </Text>
              </Div>
              <Div
                flex={1}
                alignItems="center"
                justifyContent="center"
                p="md"
                bg={myVehicle?.soatVerified ? 'primary50' : 'red50'}
                rounded="lg"
                mx="xs">
                <Text
                  fontSize="lg"
                  color={myVehicle?.soatVerified ? 'primary500' : 'red500'}
                  fontWeight="bold"
                  textAlign="center">
                  SOAT
                </Text>
              </Div>
              <Div
                flex={1}
                alignItems="center"
                justifyContent="center"
                p="md"
                bg={myVehicle?.technicalReviewVerified ? 'primary50' : 'red50'}
                rounded="lg"
                ml="xs">
                <Text
                  fontSize="lg"
                  color={
                    myVehicle?.technicalReviewVerified ? 'primary500' : 'red500'
                  }
                  fontWeight="bold"
                  textAlign="center">
                  Revisión Técnica
                </Text>
              </Div>
            </Div>
          </Div>

          <Div mt="xl">
            <Button
              block
              bg="green500"
              rounded="lg"
              fontSize="xl"
              color="white"
              fontWeight="bold"
              prefix={
                <Icon
                  mr="sm"
                  fontSize="2xl"
                  fontFamily="Ionicons"
                  name="logo-whatsapp"
                  color="white"
                />
              }>
              Envíar Documentos
            </Button>
            <Text fontSize={10} color="gray500" mt="xs">
              * Envía los documentos solicitados en buena calidad a través de
              WhatsApp.
            </Text>
          </Div>
        </Div>
      </BottomSheet>
    </Fragment>
  );
};

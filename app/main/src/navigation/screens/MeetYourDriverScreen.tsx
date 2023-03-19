import React, {useState, Fragment} from 'react';
import {StatusBar, TouchableOpacity} from 'react-native';
import {Div, Text, Avatar, Icon, Image} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RequestStackParams} from '../bottom-tabs/RequestStackScreen';
import {ScrollScreen} from '@yuju/components/templates/ScrollScreen';
import {useRequest} from '@yuju/global-hooks/useRequest';
import {MyDriverProfile} from '@yuju/types/app';
import {useDimensions} from '@yuju/global-hooks/useDimensions';
import {PhotoPreviewOverlay} from '@yuju/components/atoms/PhotoPreviewOverlay';
import Carousel from 'react-native-reanimated-carousel';
import {formatDate} from '@yuju/common/utils/format';

interface Props
  extends NativeStackScreenProps<RequestStackParams, 'MeetYourDriverScreen'> {}

export const MeetYourDriverScreen: React.FC<Props> = ({navigation, route}) => {
  const driverId = route.params.id;
  const [photoPreviewOverlayVisible, setPhotoPreviewOverlayVisible] =
    useState<boolean>(false);
  const {data: myDriverProfile} = useRequest<MyDriverProfile>({
    method: 'GET',
    url: `/trips/meet-your-driver/${driverId}`,
  });
  const [photo, setPhoto] = useState(myDriverProfile?.driver.avatar);
  const {
    window: {width: windowWidth},
  } = useDimensions();

  const openPhotoOverlay = (photo: string) => {
    setPhoto(photo);
    setPhotoPreviewOverlayVisible(true);
  };

  const closePhotoOverlay = () => {
    setPhotoPreviewOverlayVisible(false);
  };

  return (
    <ScrollScreen>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Div bg="body" px="2xl" pt={StatusBar.currentHeight} pb="3xl">
        {/** Avatar {Profile Photo} */}
        <Div justifyContent="center" alignItems="center">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => openPhotoOverlay(myDriverProfile?.driver.avatar!)}
            style={{
              borderRadius: 100,
            }}>
            <Div
              borderWidth={2}
              borderColor="gray100"
              w={150}
              h={150}
              rounded="circle"
              alignItems="center"
              justifyContent="center">
              <Avatar
                size={145}
                alignSelf="center"
                rounded="circle"
                bg="gray100"
                source={{
                  uri: myDriverProfile?.driver.avatar,
                }}
              />
            </Div>
          </TouchableOpacity>
          <Div mt="md">
            <Text fontWeight="600" fontSize="5xl">
              {myDriverProfile?.driver.name}
            </Text>

            <Div row mt="md" alignItems="center" justifyContent="center">
              <Div row mr="md">
                <Icon
                  fontFamily="Ionicons"
                  name="star"
                  // color="yellow400"
                  color="#f4c150"
                  fontSize="lg"
                  mr="xs"
                />
                <Text fontWeight="600" color="gray600" fontSize="lg">
                  {myDriverProfile?.driver.rankingsAverage ?? '0'}
                </Text>
              </Div>
              <Text color="gray300">•</Text>
              <Div row ml="md">
                <Text fontWeight="600" color="gray600" fontSize="lg">
                  {myDriverProfile?.driver.rankingsTotal ?? '0'} Calificaciones
                </Text>
              </Div>
            </Div>
          </Div>
        </Div>

        <Div my="lg" />

        <Div rounded="lg" row p="lg" borderWidth={1} borderColor="gray100">
          <Div row flex={1} alignItems="center" justifyContent="flex-start">
            <Icon
              alignSelf="center"
              fontFamily="Ionicons"
              name="navigate"
              fontSize="xl"
              color="gray600"
            />
            <Div ml="md">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="gray900"
                numberOfLines={1}>
                {myDriverProfile?.driver.completedTrips ?? '0'}
              </Text>
              <Text fontSize="sm" color="gray500" numberOfLines={1}>
                Carreras hechas
              </Text>
            </Div>
          </Div>

          <Div borderWidth={1} borderColor="gray100" borderStyle="dashed" />

          <Div row flex={1} alignItems="center" justifyContent="flex-end">
            <Icon
              alignSelf="center"
              fontFamily="Ionicons"
              name="time"
              fontSize="xl"
              color="gray600"
            />
            <Div ml="md">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="gray900"
                numberOfLines={1}>
                {formatDate(new Date(myDriverProfile?.driver.createdAt!))}
              </Text>
              <Text fontSize="sm" color="gray500" numberOfLines={1}>
                se unió a Yuju
              </Text>
            </Div>
          </Div>
        </Div>

        <Div my="lg" />

        <Div rounded="lg" bg="gray50">
          <Div py="md" justifyContent="center" alignItems="center">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              Resumen
            </Text>
          </Div>
          <Div
            bg="white"
            rounded="lg"
            p="lg"
            borderWidth={1}
            borderColor="gray50">
            {/** Solo permitir 30 caracteres */}
            <Text fontSize="lg" color="gray600">
              {myDriverProfile?.driver.summary ??
                `${
                  myDriverProfile?.driver.name ?? 'El mototaxista'
                } no agregó un resumen.`}
              {/* ¡Hola! Soy un mototaxista confiable y seguro, disponible para
              llevarte a cualquier destino en la ciudad. Mi mototaxi es cómodo y
              rápido, y siempre llegaré a tiempo. ¡Haz tu reserva ahora y
              disfruta de un viaje sin problemas! */}
            </Text>
          </Div>
        </Div>

        <Div my="lg" />

        <Div rounded="lg" bg="gray50">
          <Div py="md" justifyContent="center" alignItems="center">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              Mi Mototaxi
            </Text>
          </Div>
          <Div
            bg="white"
            rounded="lg"
            borderWidth={1}
            borderColor="gray50"
            h={300}
            overflow="hidden">
            <Carousel
              loop
              width={windowWidth}
              style={{flex: 1}}
              autoPlay={true}
              data={myDriverProfile?.driver.vehiclesPhotos ?? []}
              scrollAnimationDuration={1000}
              renderItem={({index, item: photo}) => (
                <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={0.9}
                  onPress={() => openPhotoOverlay(photo)}
                  style={{
                    flex: 1,
                    borderRadius: 100,
                  }}>
                  <Image flex={1} rounded="lg" source={{uri: photo}} />
                </TouchableOpacity>
              )}
            />
          </Div>
        </Div>

        <Div my="lg" />

        <Div rounded="lg" bg="gray50">
          <Div py="md" justifyContent="center" alignItems="center">
            <Text fontSize="xl" fontWeight="bold" textAlign="center">
              Mis Calificaciones
            </Text>
          </Div>
          <Div bg="white" rounded="lg" borderWidth={1} borderColor="gray50">
            <Div rounded="lg" p="lg">
              <Text fontSize="sm" color="gray600">
                Se muestran las últimas 5 calificaciones.
              </Text>
            </Div>
            {/** Ratings Items */}
            <Div>
              {myDriverProfile?.driver.rankings.map((ranking, index) => {
                const shouldRenderSeparator =
                  index !== myDriverProfile.driver.rankings.length - 1;

                return (
                  <Fragment key={ranking.id}>
                    <Div row p="lg" justifyContent="space-between">
                      <Avatar size={45} source={{uri: ranking.user.avatar}} />
                      <Div flex={1} ml="md">
                        <Text numberOfLines={1} fontSize="lg" fontWeight="600">
                          {ranking.user.name}
                        </Text>
                        <Div
                          row
                          justifyContent="space-between"
                          alignItems="center"
                          mt="xs">
                          <Div row>
                            <Icon
                              fontFamily="Ionicons"
                              name="star"
                              color="#f4c150"
                              fontSize="xs"
                              mr={3}
                            />
                            <Text
                              fontWeight="600"
                              color="gray600"
                              fontSize="xs">
                              {ranking.value ?? '0'}
                            </Text>
                          </Div>

                          <Text fontWeight="500" color="gray400" fontSize="xs">
                            {formatDate(new Date(ranking.createdAt))}
                          </Text>
                        </Div>
                        <Text numberOfLines={3} mt="sm" color="gray600">
                          {ranking.comment ??
                            `${
                              ranking.user.name ?? 'El pasajero'
                            } no escribió una reseña.`}
                          {/* Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Dolorum tenetur maxime veniam repellat, dolor
                          perspiciatis sint architecto aperiam possimus vero?
                          Perspiciatis, incidunt libero ut excepturi deserunt et
                          aperiam a vitae. */}
                        </Text>
                      </Div>
                    </Div>

                    {/** Separator */}

                    {shouldRenderSeparator ? (
                      <Div
                        my="md"
                        borderWidth={1}
                        borderStyle="dashed"
                        borderColor="gray50"
                        rounded="circle"
                        mx="lg"
                      />
                    ) : null}
                  </Fragment>
                );
              })}
            </Div>
          </Div>
        </Div>
      </Div>

      {/** Driver Avatar Preview */}
      {photoPreviewOverlayVisible ? (
        <PhotoPreviewOverlay
          // TODO: una vez salga a producción remover esta condición y dejar solo en `photo`
          avatar={
            typeof photo === 'string'
              ? {
                  uri: photo,
                }
              : photo
          }
          closePhotoOverlay={closePhotoOverlay}
          photoPreviewOverlayVisible={photoPreviewOverlayVisible}
        />
      ) : null}
    </ScrollScreen>
  );
};

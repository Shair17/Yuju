import React, {useCallback, useRef, useEffect} from 'react';
import {Div, Text, Button} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RequestStackParams} from '../bottom-tabs/RequestStackScreen';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {ChooseLocationScreenHeading} from '@yuju/components/atoms/ChooseLocationScreenHeading';
import {useTripStore} from '@yuju/global-stores/useTripStore';

// @ts-ignore
navigator.geolocation = require('react-native-geolocation-service');

interface Props
  extends NativeStackScreenProps<
    RequestStackParams,
    'ChooseDestinationLocationScreen'
  > {}

export const ChooseDestinationLocationScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const setToLocation = useTripStore(s => s.setToLocation);
  const googlePlacesAutocompleteRef = useRef<GooglePlacesAutocompleteRef>(null);

  useFocusEffect(
    useCallback(() => {
      const timeoutId = setTimeout(() => {
        googlePlacesAutocompleteRef.current?.focus();
      }, 100);

      return () => clearTimeout(timeoutId);
    }, [navigation]),
  );

  return (
    <Div flex={1} bg="body" px="2xl" pt="md" pb="3xl">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/** Heading Text  */}
      <ChooseLocationScreenHeading title="Elige ubicaciones de" />

      <GooglePlacesAutocomplete
        ref={googlePlacesAutocompleteRef}
        placeholder="Buscar"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: 'AIzaSyDBND9RZ9d3FNN9B2VNkW5v9NnhRghlxUg',
          language: 'es',
          components: 'country:pe',
        }}
        // GooglePlacesDetailsQuery={{}}
        fetchDetails
        currentLocation
        currentLocationLabel="Mi ubicación actual"
        // suppressDefaultStyles
        debounce={500}
        styles={{
          container: {
            flex: 1,
          },
          textInputContainer: {
            flexDirection: 'row',
          },
          textInput: {
            backgroundColor: '#FFFFFF',
            height: 44,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 15,
            flex: 1,
          },
          poweredContainer: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderColor: '#c8c7cc',
            borderTopWidth: 0.5,
          },
          powered: {},
          listView: {},
          row: {
            backgroundColor: '#FFFFFF',
            padding: 13,
            height: 44,
            flexDirection: 'row',
          },
          separator: {
            height: 0.5,
            backgroundColor: '#c8c7cc',
          },
          description: {},
          loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 20,
          },
        }}
      />

      <Button
        rounded="lg"
        block
        onPress={() => {
          setToLocation({
            latitude: -7.241504526019357,
            longitude: -79.40049305319835,
          });

          navigation.goBack();
        }}>
        Talambo
      </Button>
    </Div>
  );
};

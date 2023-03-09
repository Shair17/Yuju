import React, {useRef, useCallback, useState} from 'react';
import {StatusBar} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {RequestStackParams} from '../bottom-tabs/RequestStackScreen';
import {ChooseLocationScreenHeading} from '@yuju/components/atoms/ChooseLocationScreenHeading';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';

// @ts-ignore
navigator.geolocation = require('react-native-geolocation-service');

interface Props
  extends NativeStackScreenProps<
    RequestStackParams,
    'ChooseStartingLocationScreen'
  > {}

export const ChooseStartingLocationScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
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
    </Div>
  );
  return (
    <Div>
      <Text>ChooseStartingLocationScreen</Text>
      <Text>
        Aquí mostrar un boton para poner mi ubicación actual, luego todas las
        direcciones que el usuario tiene guardadas y al final poner un texto
        diciendo que puede buscar automaticamente una dirección
      </Text>
    </Div>
  );
};

import React, {useCallback, useRef, useEffect} from 'react';
import {Div, Text} from 'react-native-magnus';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RequestStackParams} from '../bottom-tabs/RequestStackScreen';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import {useFocusEffect} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {ChooseLocationScreenHeading} from '@yuju/components/atoms/ChooseLocationScreenHeading';

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

      <Text>
        Aquí poner todas las direcciones que el usuario tiene guardadas, y luego
        poner un texto diciendo que puede escribir cualquier direccion en el
        input
      </Text>
    </Div>
  );
};

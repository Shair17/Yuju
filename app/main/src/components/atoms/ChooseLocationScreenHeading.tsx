import React, {useState, useEffect} from 'react';
import {Div, Text} from 'react-native-magnus';
import Ticker, {Tick} from 'react-native-ticker';
import {getRandomNumber} from '@yuju/common/utils/random';

const citiesFallback = [
  'Chepén',
  'Guadalupe',
  'Chequen',
  'Ciudad de Dios',
  'Pacanga',
  'Pacanguilla',
  'San José de Moro',
  'El Salvador',
  'Pueblo Nuevo',
  'Talambo',
  'Pacasmayo',
  'San Pedro de Lloc',
  'Limoncarro',
  'Jequetepeque',
];

interface Props {
  title: string;
  cities?: string[];
  changeCitieInterval?: number;
}

export const ChooseLocationScreenHeading: React.FC<Props> = ({
  title,
  cities = citiesFallback,
  changeCitieInterval = 1500,
}) => {
  const [state, setState] = useState({
    citie: cities[getRandomNumber(0, cities.length - 1)],
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setState({
        citie: cities[getRandomNumber(0, cities.length - 1)],
      });
    }, changeCitieInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [cities, changeCitieInterval]);

  return (
    <Div>
      <Text fontSize="sm" color="gray400">
        {title}
      </Text>
      <Div mt="xs">
        <Ticker
          textStyle={{
            color: '#111827',
            fontSize: 27,
            fontWeight: 'bold',
          }}>
          <Tick rotateItems={cities}>{state.citie}</Tick>
        </Ticker>
      </Div>
    </Div>
  );
};

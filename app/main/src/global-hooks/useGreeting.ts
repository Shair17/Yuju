import {useState} from 'react';
import {useInterval} from './useInterval';

export const useGreeting = (): string => {
  const [today, setDate] = useState<Date>(new Date());
  const hour = today.getHours();
  const greeting = `${
    (hour < 12 && 'Buenos días') ||
    (hour < 18 && 'Buenas tardes') ||
    'Buenas noches'
  }`;

  useInterval(() => setDate(new Date()), 60 * 60 * 1000);

  return greeting;
};

import {useEffect, useState} from 'react';

export const useGreeting = (): string => {
  const [today, setDate] = useState<Date>(new Date());

  useEffect(() => {
    // Update current time every 1 hour
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60 * 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const hour = today.getHours();
  const greeting = `${
    (hour < 12 && 'Buenos días') ||
    (hour < 18 && 'Buenas tardes') ||
    'Buenas noches'
  }`;

  return greeting;
};

export const getRandomNumber = (min: number = 0, max: number = 1): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.abs(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const getRandomPlaceholder = () => {
  const strings = [
    'Por ejemplo: Llevo a mi perro conmigo',
    'Este mensaje es opcional',
    'Por ejemplo: Por favor traes vuelto de 10 soles',
    'Por ejemplo: Voy a demorar unos minutos, me esperas',
    'Por ejemplo: Llevo maletas conmigo',
    'Por ejemplo: Necesito que me ayudes con unas bolsas',
    'Por ejemplo: ¿Puedes recogerme en 10 minutos?',
    'Por ejemplo: ¿Podemos hacer una parada rápida en el cajero automático?',
    'Por ejemplo: ¿Podemos hacer una parada rápida en el banco?',
  ];
  const randomIndex = Math.floor(Math.random() * strings.length);
  return strings[randomIndex];
};

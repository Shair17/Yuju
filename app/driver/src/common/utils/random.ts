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
  const randomIndex = getRandomNumber(0, strings.length - 1);
  return strings[randomIndex];
};

export const getRandomSummaryPlaceholder = () => {
  const resumenesMototaxista = [
    'Por ejemplo: Soy un mototaxista con experiencia y buen trato al cliente.',
    'Por ejemplo: Soy rápido y seguro, llega a tiempo a tu destino.',
    'Por ejemplo: Conozco bien la ciudad y te lleva por la mejor ruta.',
    'Por ejemplo: Tengo tarifas económicas y servicio de calidad.',
    'Por ejemplo: Siempre estoy dispuesto a ayudarte con tus paquetes.',
    'Por ejemplo: Manejo con precaución y responsabilidad.',
    'Por ejemplo: Estoy disponible las 24 horas del día.',
    'Por ejemplo: Soy amable y respetuoso con todos los pasajeros.',
    'Por ejemplo: Conduzco mototaxi desde hace más de 5 años.',
    'Por ejemplo: Soy tu mejor opción para moverte en la ciudad.',
    'Tu resumen es obligatorio.',
  ];
  const randomIndex = getRandomNumber(0, resumenesMototaxista.length - 1);
  return resumenesMototaxista[randomIndex];
};

export const getRandomPlate = () => {
  let letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let numeros = '0123456789';
  let placa = '';

  placa += letras.charAt(Math.floor(Math.random() * letras.length));
  placa += numeros.charAt(Math.floor(Math.random() * numeros.length));

  let segundaLetra = letras.charAt(Math.floor(Math.random() * letras.length));

  while (segundaLetra === placa.charAt(0)) {
    segundaLetra = letras.charAt(Math.floor(Math.random() * letras.length));
  }

  placa += segundaLetra;

  for (let i = 0; i < 3; i++) {
    placa += numeros.charAt(Math.floor(Math.random() * numeros.length));
  }

  return placa;
};

import {makeTheme} from 'dripsy';
import {defaultColors} from './colors';

const lightColors = {
  $background: '#fff',
  $text: '#000',
  $primary: '#276eff',
};

const lightTheme = makeTheme({
  colors: {
    ...defaultColors,
    ...lightColors,
  },
  space: {
    $none: 0,
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 16,
    $4: 32,
    $5: 64,
    $6: 128,
    $7: 256,
    $8: 512,

    '-$1': -4,
    '-$2': -8,
    '-$3': -16,
    '-$4': -32,
    '-$5': -64,
    '-$6': -128,
    '-$7': -256,
    '-$8': -512,
  },
  radii: {
    $none: 0,
    $0: 0,
    $sm: 2,
    $normal: 4,
    $md: 6,
    $lg: 8,
    $xl: 12,
    $2xl: 16,
    $3xl: 24,
    $full: 9999,
  },
  fontSizes: {
    $xs: 12,
    $sm: 14,
    $base: 16,
    $lg: 18,
    $xl: 20,
    $2xl: 24,
    $3xl: 30,
    $4xl: 36,
    $5xl: 48,
    $6xl: 60,
    $7xl: 72,
    $8xl: 96,
    $9xl: 128,
  },
  text: {
    body: {
      color: '$text',
    },
  },
  useLocalStorage: false,
});

type MyTheme = typeof lightTheme;

declare module 'dripsy' {
  interface DripsyCustomTheme extends MyTheme {}
}

const darkColors: typeof lightColors = {
  $background: '#000',
  $text: '#fff',
  $primary: '#276eff',
};

// luego llenar el darkTheme
const darkTheme = makeTheme({
  colors: {
    ...defaultColors,
    ...darkColors,
  },
  text: {
    body: {
      color: '$text',
    },
  },
  useLocalStorage: false,
});

export {darkTheme, lightTheme};

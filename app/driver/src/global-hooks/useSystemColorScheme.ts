import {useColorScheme} from 'react-native';

export const useSystemColorScheme = () => useColorScheme() ?? 'light';

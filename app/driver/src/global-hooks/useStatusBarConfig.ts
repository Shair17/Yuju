import {useTheme} from 'react-native-magnus';

export const useStatusBarConfig = () => {
  const {theme} = useTheme();

  return {
    backgroundColor: theme.name === 'dark' ? '#000' : '#fff',
    barStyle: theme.name === 'dark' ? 'light' : 'dark',
  };
};

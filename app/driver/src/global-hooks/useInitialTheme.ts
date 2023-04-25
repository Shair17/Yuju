import {useThemeStorage} from './useThemeStorage';

export const useInitialTheme = () => {
  const [theme] = useThemeStorage();

  return {
    themeName: theme || 'light',
    isDarkTheme: theme === 'dark',
  };
};

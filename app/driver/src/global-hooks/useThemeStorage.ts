import {useMMKVString} from 'react-native-mmkv';
import {storage} from '@yuju/services/storage';
import {themeStorageKey} from '@yuju/common/constants/theme';

export type Theme = 'light' | 'dark' | undefined;

type SetTheme = (
  value: Exclude<Theme, undefined> | ((current: Theme) => Theme) | undefined,
) => void;

type ThemeStoragePayload = [Theme, SetTheme];

export const useThemeStorage = () =>
  <ThemeStoragePayload>useMMKVString(themeStorageKey, storage);

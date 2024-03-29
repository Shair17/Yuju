import {getVersion} from 'react-native-device-info';

export const useAppVersion = () => {
  const version = getVersion();

  return version;
};

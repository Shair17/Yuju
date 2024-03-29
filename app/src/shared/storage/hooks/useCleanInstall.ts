import {useCallback} from 'react';
import {useMMKVBoolean} from 'react-native-mmkv';
import {HAS_CLEAN_INSTALL_STORAGE_KEY} from '../keys';
import {storage} from '../instance';

export const useCleanInstall = () => {
  const [hasCleanInstall, setHasCleanInstall] = useMMKVBoolean(
    HAS_CLEAN_INSTALL_STORAGE_KEY,
    storage,
  );

  const resetHasCleanInstall = useCallback(() => {
    setHasCleanInstall(undefined);
  }, []);

  return {
    hasCleanInstall: hasCleanInstall ?? true,
    setHasCleanInstall,
    resetHasCleanInstall,
  };
};

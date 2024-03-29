import {useNetInfo} from '@react-native-community/netinfo';

type ReturnNetworkConnected = 'loading' | 'connected' | 'disconnected';

export const useIsNetworkConnected = (): ReturnNetworkConnected => {
  const netInfo = useNetInfo();

  if (netInfo.isConnected == null) {
    return 'loading';
  }

  return netInfo.isConnected ? 'connected' : 'disconnected';
};

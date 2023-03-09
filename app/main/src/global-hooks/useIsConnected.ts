import {useNetInfo} from '@react-native-community/netinfo';

type ReturnIsConnected = 'loading' | 'connected' | 'disconnected';

export const useIsConnected = (): ReturnIsConnected => {
  const netInfo = useNetInfo();

  if (netInfo.isConnected == null) return 'loading';

  return netInfo.isConnected ? 'connected' : 'disconnected';
};

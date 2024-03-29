import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
  focusManager,
} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import {useAppState} from '../hooks/useAppState';

const queryClient = new QueryClient();

onlineManager.setEventListener(setOnline =>
  NetInfo.addEventListener(state => setOnline(state.isConnected!!)),
);

export const Query: React.FC<React.PropsWithChildren> = ({children}) => {
  const appState = useAppState();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(appState === 'active');
    }
  }, [appState]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

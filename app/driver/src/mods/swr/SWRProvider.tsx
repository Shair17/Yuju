import React from 'react';
import {AppState, type AppStateStatus} from 'react-native';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {useAppState} from '@yuju/global-hooks/useAppState';
import {SWRConfig} from 'swr';

export const SWRProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const netInfo = useNetInfo();
  const appState = useAppState();

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isOnline() {
          if (netInfo.isConnected == null) return false;

          return netInfo.isConnected;
        },
        isVisible() {
          return appState === 'active';
        },
        initFocus(callback: () => void) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState: AppStateStatus) => {
            if (
              appState.match(/inactive|background/) &&
              nextAppState === 'active'
            ) {
              callback();
            }
            appState = nextAppState;
          };

          const subscription = AppState.addEventListener(
            'change',
            onAppStateChange,
          );

          return () => {
            subscription.remove();
          };
        },
        initReconnect(callback) {
          if (netInfo.isConnected == null) {
            return;
          }

          let isOnline = netInfo.isConnected;

          if (isOnline) {
            callback();
          }

          const unsubscribe = NetInfo.addEventListener(nextState => {
            if (nextState.isConnected) {
              callback();
            }

            isOnline = !!nextState.isConnected;
          });

          return () => {
            unsubscribe();
          };
        },
      }}>
      {children}
    </SWRConfig>
  );
};

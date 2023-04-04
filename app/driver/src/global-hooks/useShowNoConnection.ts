import {useEffect} from 'react';
import {Vibration} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {Notifier} from 'react-native-notifier';

export const useShowNoConnection = () => {
  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isConnected == null) return;

    const isOnline = netInfo.isConnected;

    if (!isOnline) {
      Notifier.showNotification({
        title: 'Internet',
        description: 'Sin conexión a Internet.',
        onShown() {
          Vibration.vibrate(15);
        },
        onHidden() {
          Vibration.vibrate(15);
        },
      });
    }
  }, [netInfo]);
};
import React, {Fragment, useEffect} from 'react';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';
import {
  useSocketStore,
  Driver,
  SocketStoreValues,
} from '@yuju/mods/socket/stores/useSocketStore';
import {useIsNew} from '@yuju/global-hooks/useIsNew';
import {useIsAuthenticated} from '@yuju/global-hooks/useIsAuthenticated';

export const SocketProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const isAuthenticated = useIsAuthenticated();
  const accessToken = useAuthStore(t => t.accessToken);
  const socket = useSocketStore(s => s.socket);
  const setSocket = useSocketStore(s => s.setSocket);
  const setSocketStatus = useSocketStore(s => s.setStatus);
  const setAvailableDrivers = useSocketStore(s => s.setAvailableDrivers);
  const setInRide = useSocketStore(s => s.setInRide);
  const setInRidePending = useSocketStore(s => s.setInRidePending);
  const isNew = useIsNew();

  useEffect(() => {
    setSocket(accessToken);

    return () => {
      socket?.disconnect();
    };
  }, [accessToken]);

  useEffect(() => {
    if (!socket) {
      setSocketStatus('loading');
      return;
    }

    setSocketStatus(socket.connected ? 'online' : 'offline');
  }, []);

  useEffect(() => {
    socket?.on('connect', () => {
      setSocketStatus('online');

      if (isNew) {
        return;
      }

      Notifier.showNotification({
        description: 'Conectado a Yuju',
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'success',
        },
        duration: 1000,
      });
    });

    return () => {
      socket?.off('connect');
    };
  }, [socket, isNew]);

  useEffect(() => {
    socket?.on('disconnect', () => {
      setSocketStatus('offline');

      if (isNew) {
        return;
      }

      Notifier.showNotification({
        description: 'Desconectado de Yuju, reconectando...',
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: 'warn',
        },
        duration: 1000,
      });
    });

    return () => {
      socket?.off('disconnect');
    };
  }, [socket, isNew]);

  useEffect(() => {
    if (!isAuthenticated || isNew) {
      return;
    }

    const listener = (availableDrivers: Driver[]) => {
      setAvailableDrivers(availableDrivers);
    };

    socket?.on('AVAILABLE_DRIVERS', listener);

    return () => {
      socket?.off('AVAILABLE_DRIVERS', listener);
    };
  }, [socket, isAuthenticated, isNew]);

  useEffect(() => {
    if (!isAuthenticated || isNew) {
      return;
    }

    const inRideListener = (inRide: SocketStoreValues['inRide']) =>
      setInRide(inRide);

    const inRidePendingListener = (
      inRidePending: SocketStoreValues['inRidePending'],
    ) => setInRidePending(inRidePending);

    socket?.on('PASSENGER_IN_RIDE', inRideListener);

    socket?.on('PASSENGER_IN_RIDE_PENDING', inRidePendingListener);

    return () => {
      socket?.off('PASSENGER_IN_RIDE', inRideListener);
      socket?.off('PASSENGER_IN_RIDE_PENDING', inRidePendingListener);
    };
  }, [socket, isAuthenticated, isNew]);

  return <Fragment>{children}</Fragment>;
};

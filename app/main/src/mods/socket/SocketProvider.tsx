import React, {Fragment, useEffect} from 'react';
import {Notifier, NotifierComponents} from 'react-native-notifier';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';
import {useSocketStore} from '@yuju/mods/socket/stores/useSocketStore';
import {useIsNew} from '@yuju/global-hooks/useIsNew';

export const SocketProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const accessToken = useAuthStore(t => t.accessToken);
  const socket = useSocketStore(s => s.socket);
  const setSocket = useSocketStore(s => s.setSocket);
  const setSocketStatus = useSocketStore(s => s.setStatus);
  const isNew = useIsNew();

  useEffect(() => {
    setSocket(accessToken);
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

      if (isNew) return;

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

      if (isNew) return;

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

  return <Fragment>{children}</Fragment>;
};

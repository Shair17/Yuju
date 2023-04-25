import React, {useEffect} from 'react';
import {useAuthStore} from '@yuju/global-stores/useAuthStore';
import {
  SocketStoreValues,
  useSocketStore,
} from '@yuju/mods/socket/stores/useSocketStore';
import {useIsNew} from '@yuju/global-hooks/useIsNew';
import {useIsAuthenticated} from '@yuju/global-hooks/useIsAuthenticated';
import {showAlert} from '@yuju/common/utils/notification';

export const SocketProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const isAuthenticated = useIsAuthenticated();
  const accessToken = useAuthStore(t => t.accessToken);
  const socket = useSocketStore(s => s.socket);
  const setSocket = useSocketStore(s => s.setSocket);
  const setSocketStatus = useSocketStore(s => s.setStatus);
  const setPendingRides = useSocketStore(s => s.setPendingRides);
  // const setInRide = useSocketStore(s => s.setInRide);
  // const setAllowedToUseApp = useSocketStore(s => s.setAllowedToUseApp);
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

      showAlert({
        description: 'Conectado a Yuju',
        alertType: 'success',
        duration: 1000,
      });
    });

    return () => {
      socket?.off('connect');
    };
  }, [socket, isNew]);

  useEffect(() => {
    const listener = () => {
      setSocketStatus('offline');

      if (isNew) {
        return;
      }

      showAlert({
        description: 'Desconectado de Yuju. Reconectando...',
        alertType: 'warn',
        duration: 1000,
      });
    };

    socket?.on('disconnect', listener);

    return () => {
      socket?.off('disconnect', listener);
    };
  }, [socket, isNew]);

  useEffect(() => {
    if (!isAuthenticated || isNew) {
      return;
    }

    const pendingRidesListener = (
      pendingRides: SocketStoreValues['pendingRides'],
    ) => {
      setPendingRides(pendingRides);
    };

    socket?.on('PENDING_RIDES', pendingRidesListener);

    return () => {
      socket?.off('PENDING_RIDES', pendingRidesListener);
    };
  }, [socket, isAuthenticated, isNew]);

  // useEffect(() => {
  //   if (!isAuthenticated || isNew) {
  //     return;
  //   }

  //   const inRideListener = (inRide: SocketStoreValues['inRide']) =>
  //     setInRide(inRide);

  //   const allowedToUseAppListener = (
  //     allowedToUseApp: SocketStoreValues['allowedToUseApp'],
  //   ) => setAllowedToUseApp(allowedToUseApp);

  // socket?.on('PASSENGER_IN_RIDE', inRideListener);

  // socket?.on('ALLOWED_TO_USE_APP', allowedToUseAppListener);

  // return () => {
  // socket?.off('PASSENGER_IN_RIDE', inRideListener);
  //     socket?.off('ALLOWED_TO_USE_APP', allowedToUseAppListener);
  //   };
  // }, [socket, isAuthenticated, isNew]);

  return <>{children}</>;
};

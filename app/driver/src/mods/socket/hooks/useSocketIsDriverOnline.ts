import {useState, useEffect} from 'react';
import {Socket} from 'socket.io-client';
import {useSocketStore} from '../stores/useSocketStore';

const useSocketStoreSelector = (s: any) => s.socket;

// Hook useful to get if driver by id is online
export const useSocketIsDriverOnline = (driverId: string): boolean => {
  const [driverIsOnline, setDriverIsOnline] = useState<boolean>(false);
  const socket = <Socket | null>useSocketStore(useSocketStoreSelector);

  useEffect(() => {
    socket?.emit('IS_DRIVER_ONLINE', driverId, (isOnline: boolean) => {
      setDriverIsOnline(isOnline);
    });
  }, [socket, driverId]);

  return driverIsOnline;
};

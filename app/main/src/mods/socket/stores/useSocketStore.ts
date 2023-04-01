import {create} from 'zustand';
import {combine} from 'zustand/middleware';
import {SOCKET_URL} from '@yuju/mods/socket/constants/socket';
import io, {Socket} from 'socket.io-client';
import {isValidToken} from '@yuju/common/utils/token';
import {isTokenExpired} from '@yuju/services/refresh-token';

export interface Driver {
  id: string;
  facebookId: string;
  name: string;
  email: string;
  phoneNumber: string;
  dni: string;
  avatar: string;
  isAdmin: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
}

export type SocketStatus = 'loading' | 'online' | 'offline';

type SocketStoreValues = {
  socket: Socket | null;
  status: SocketStatus;
  availableDrivers: Driver[];
  isInRide: boolean;
  isInPendingRide: boolean;
};

const getDefaultValues = (): SocketStoreValues => {
  return {
    socket: null,
    status: 'loading',
    availableDrivers: [],
    isInRide: false,
    isInPendingRide: false,
  };
};

export const useSocketStore = create(
  combine(getDefaultValues(), (set, get) => ({
    setSocket: (token: string) => {
      if (!token) {
        get().socket?.disconnect();

        set({
          socket: null,
          status: 'offline',
        });

        return;
      }

      if (!isValidToken(token)) {
        get().socket?.disconnect();

        set({
          socket: null,
          status: 'offline',
        });

        return;
      }

      if (isTokenExpired(token)) {
        get().socket?.disconnect();

        set({
          socket: null,
          status: 'offline',
        });

        return;
      }

      set({
        socket: io(SOCKET_URL, {
          transports: ['websocket'],
          autoConnect: true,
          auth: {
            token,
          },
        }),
      });
    },
    setStatus: (status: SocketStatus) => set({status}),
    setAvailableDrivers: (availableDrivers: Driver[]) =>
      set({availableDrivers}),
    setIsInRide: (isInRide: boolean) => set({isInRide}),
    setIsInPendingRide: (isInPendingRide: boolean) => set({isInPendingRide}),
  })),
);

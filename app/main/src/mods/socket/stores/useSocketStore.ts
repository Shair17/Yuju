import {create} from 'zustand';
import {combine} from 'zustand/middleware';
import {SOCKET_URL} from '@yuju/mods/socket/constants/socket';
import io, {Socket} from 'socket.io-client';
import {isValidToken} from '@yuju/common/utils/token';
import {isTokenExpired} from '@yuju/services/refresh-token';

export interface BaseUser {
  id: string;
  facebookId: string;
  name: string;
  email: string;
  phoneNumber: string;
  dni: string;
  avatar: string;
  isAdmin: boolean;
}

export interface Driver extends BaseUser {
  location: ILocation;
}

export interface User extends BaseUser {
  location: ILocation;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

interface InRide {
  // this should be trip database id
  id: string;
  user: User;
  driver: Driver;
  currentLocation: ILocation;
  // use nanoid
  trackingCode: string;
  from: {
    address?: string;
    location: ILocation;
  };
  to: {
    address?: string;
    location: ILocation;
  };
  passengersQuantity: number;
  ridePrice: number;
}

interface InRidePending {
  // this should be trip database id
  id: string;
  // Solo hay User, el driver aún estaría pendiente...
  user: User;
  // y una vez se encuentre un driver pasaría a la otra cola de inRideQueue, y se removería de inRidePendingQueue
  from: {
    address?: string;
    location: ILocation;
  };
  to: {
    address?: string;
    location: ILocation;
  };
  passengersQuantity: number;
  ridePrice: number;
}

export type SocketStatus = 'loading' | 'online' | 'offline';

export type SocketStoreValues = {
  socket: Socket | null;
  status: SocketStatus;
  availableDrivers: Driver[];
  inRide: InRide | null;
  inRidePending: InRidePending | null;
  allowedToUseApp: boolean;
};

const getDefaultValues = (): SocketStoreValues => {
  return {
    socket: null,
    status: 'loading',
    availableDrivers: [],
    inRide: null,
    inRidePending: null,
    allowedToUseApp: true,
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
    setInRide: (inRide: SocketStoreValues['inRide']) => set({inRide}),
    setInRidePending: (inRidePending: SocketStoreValues['inRidePending']) =>
      set({inRidePending}),
    setAllowedToUseApp: (
      allowedToUseApp: SocketStoreValues['allowedToUseApp'],
    ) => set({allowedToUseApp}),
  })),
);

import {create} from 'zustand';
import {combine} from 'zustand/middleware';
import {SOCKET_URL} from '@yuju/mods/socket/constants/socket';
import io, {Socket} from 'socket.io-client';
import {isValidToken} from '@yuju/common/utils/token';
import {isTokenExpired} from '@yuju/services/refresh-token';

export type SocketStatus = 'loading' | 'online' | 'offline';

type SocketStoreValues = {
  socket: Socket | null;
  status: SocketStatus;
};

const getDefaultValues = (): SocketStoreValues => {
  return {
    socket: null,
    status: 'loading',
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
          forceNew: true,
          auth: {
            token,
          },
        }),
      });
    },
    setStatus: (status: SocketStatus) => set({status}),
  })),
);

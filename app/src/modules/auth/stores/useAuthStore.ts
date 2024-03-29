import {create} from 'zustand';
import {combine} from 'zustand/middleware';
import {AUTH_INITIAL_STATE} from '../constants';
import {type Tokens} from '../types/tokens';
import {type AuthStatus} from '../types/status';
import {TOKENS_STORAGE_KEYS} from '../storage/keys';
import {storage} from '@yuju/shared/storage/instance';

const getDefaultValues = (): Tokens & AuthStatus => {
  return {
    accessToken:
      storage.getString(TOKENS_STORAGE_KEYS.ACCESS_TOKEN) ??
      AUTH_INITIAL_STATE.accessToken,
    refreshToken:
      storage.getString(TOKENS_STORAGE_KEYS.REFRESH_TOKEN) ??
      AUTH_INITIAL_STATE.refreshToken,
    status: AUTH_INITIAL_STATE.status,
  };
};

export const useAuthStore = create(
  combine(getDefaultValues(), (set, get) => ({
    setAccessToken: (accessToken: NonNullable<Tokens['accessToken']>) => {
      storage.set(TOKENS_STORAGE_KEYS.ACCESS_TOKEN, accessToken);

      set({
        accessToken,
      });
    },
    setRefreshToken: (refreshToken: NonNullable<Tokens['refreshToken']>) => {
      storage.set(TOKENS_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      set({
        refreshToken,
      });
    },
    setTokens: ({
      accessToken,
      refreshToken,
    }: Record<keyof Tokens, NonNullable<Tokens[keyof Tokens]>>) => {
      storage.set(TOKENS_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      storage.set(TOKENS_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      set({
        accessToken,
        refreshToken,
      });
    },
    removeTokens: () => {
      storage.delete(TOKENS_STORAGE_KEYS.ACCESS_TOKEN);
      storage.delete(TOKENS_STORAGE_KEYS.REFRESH_TOKEN);

      set({
        accessToken: null,
        refreshToken: null,
      });
    },
    setStatus: (status: AuthStatus['status']) => {
      set({
        status,
      });
    },
    resetStatus: () => {
      set({
        status: AUTH_INITIAL_STATE.status,
      });
    },
  })),
);

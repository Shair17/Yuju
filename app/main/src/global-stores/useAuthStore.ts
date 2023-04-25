import {create} from 'zustand';
import {combine} from 'zustand/middleware';
import {
  accessToken,
  refreshToken,
  accessTokenKey,
  refreshTokenKey,
  Tokens,
  isNewKey,
  isNew,
} from '@yuju/common/constants/auth';
import {http} from '@yuju/services/http';
import {storage} from '@yuju/services/storage';

export type ITokens = Tokens;

const getDefaultValues = (): Tokens & {isNew: boolean} => {
  return {
    accessToken: storage.getString(accessTokenKey) ?? accessToken,
    refreshToken: storage.getString(refreshTokenKey) ?? refreshToken,
    isNew: storage.getBoolean(isNewKey) ?? isNew,
  };
};

export const useAuthStore = create(
  combine(getDefaultValues(), (set, get) => ({
    setIsNew: (isNew: boolean) => {
      storage.set(isNewKey, isNew);

      set({
        isNew,
      });
    },
    setAccessToken: (accessToken: string) => {
      storage.set(accessTokenKey, accessToken);

      set({
        accessToken,
      });
    },
    setRefreshToken: (refreshToken: string) => {
      storage.set(refreshTokenKey, refreshToken);

      set({
        refreshToken,
      });
    },
    setTokens: ({accessToken, refreshToken}: Tokens) => {
      storage.set(accessTokenKey, accessToken);
      storage.set(refreshTokenKey, refreshToken);

      set({
        accessToken,
        refreshToken,
      });
    },
    removeTokens: () => {
      storage.delete(accessTokenKey);
      storage.delete(refreshTokenKey);

      set({
        accessToken: '',
        refreshToken: '',
      });
    },
    removeIsNewCache: () => {
      storage.delete(isNewKey);

      set({
        isNew: isNew,
      });
    },
    logOutFromYuju: async () => {
      await http.delete('/auth/user/facebook/logout');
    },
  })),
);

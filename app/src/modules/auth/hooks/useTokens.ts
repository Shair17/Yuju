import {useCallback} from 'react';
import {useMMKVString} from 'react-native-mmkv';
import {TOKENS_STORAGE_KEYS} from '../storage/keys';
import {storage} from '@yuju/shared/storage/instance';
import {type Tokens} from '../types/tokens';

export const useTokens = () => {
  const [accessTokenFromStorage, setAccessTokenToStorage] = useMMKVString(
    TOKENS_STORAGE_KEYS.ACCESS_TOKEN,
    storage,
  );
  const [refreshTokenFromStorage, setRefreshTokenToStorage] = useMMKVString(
    TOKENS_STORAGE_KEYS.ACCESS_TOKEN,
    storage,
  );

  const setAccessToken = useCallback(
    (newAccessToken: NonNullable<Tokens['accessToken']>) => {
      setAccessTokenToStorage(newAccessToken);
    },
    [setAccessTokenToStorage],
  );

  const setRefreshToken = useCallback(
    (newRefreshToken: NonNullable<Tokens['refreshToken']>) => {
      setRefreshTokenToStorage(newRefreshToken);
    },
    [setRefreshTokenToStorage],
  );

  const setTokens = useCallback(
    (tokens: Record<keyof Tokens, NonNullable<Tokens[keyof Tokens]>>) => {
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
    },
    [setAccessToken, setRefreshToken],
  );

  const removeAccessToken = useCallback(() => {
    setAccessTokenToStorage(undefined);
  }, [setAccessTokenToStorage]);

  const removeRefreshToken = useCallback(() => {
    setRefreshTokenToStorage(undefined);
  }, [setRefreshTokenToStorage]);

  const removeTokens = useCallback(() => {
    removeAccessToken();
    removeRefreshToken();
  }, [removeAccessToken, removeRefreshToken]);

  return {
    tokens: {
      accessToken: accessTokenFromStorage ?? null,
      refreshToken: refreshTokenFromStorage ?? null,
    },
    setTokens,

    setAccessToken,
    setRefreshToken,

    removeAccessToken,
    removeRefreshToken,

    removeTokens,
  };
};

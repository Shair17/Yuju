import jwtDecode, {type JwtPayload} from 'jwt-decode';
import AxiosGlobal, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {useAuthStore, ITokens} from '@yuju/global-stores/useAuthStore';
import {isValidToken} from '@yuju/common/utils/token';
import {showAlert} from '@yuju/common/utils/notification';

// a little time before expiration to try refresh (seconds)
const EXPIRE_FUDGE = 10;

type Token = string;

export const isLoggedIn = (): boolean => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  if (!isValidToken(refreshToken)) {
    return false;
  }

  if (isTokenExpired(refreshToken)) {
    clearAuthTokens();
    return false;
  }

  return !!refreshToken;
};

export const setAuthTokens = ({accessToken, refreshToken}: ITokens): void => {
  useAuthStore.setState({
    accessToken,
    refreshToken,
  });
};

export const setAccessToken = async (token: Token): Promise<void> => {
  const tokens = getAuthTokens();

  if (!tokens) {
    throw new Error(
      'Unable to update access token since there are not tokens currently stored',
    );
  }

  tokens.accessToken = token;
  return setAuthTokens(tokens);
};

export const clearAuthTokens = (): void =>
  useAuthStore.getState().removeTokens();

export const getRefreshToken = (): Token | undefined => {
  const tokens = getAuthTokens();
  return tokens ? tokens.refreshToken : undefined;
};

export const getAccessToken = (): Token | undefined => {
  const tokens = getAuthTokens();
  return tokens ? tokens.accessToken : undefined;
};

export const refreshTokenIfNeeded = async (
  requestRefresh: TokenRefreshRequest,
): Promise<Token | undefined> => {
  let accessToken = getAccessToken();

  // check if access token is expired
  if (!accessToken || isTokenExpired(accessToken)) {
    // do refresh
    accessToken = await refreshToken(requestRefresh);
  }

  return accessToken;
};

export const applyAuthTokenInterceptor = (
  axios: AxiosInstance,
  config: AuthTokenInterceptorConfig,
): void => {
  if (!axios.interceptors) {
    throw new Error(`invalid axios instance: ${axios}`);
  }
  // @ts-ignore
  axios.interceptors.request.use(authTokenInterceptor(config));

  axios.interceptors.response.use(
    response => response,
    error => {
      if (!AxiosGlobal.isAxiosError(error)) {
        throw error;
      }

      const status = error.response?.status;
      const response = <{error: string; message: string; statusCode: number}>(
        error.response?.data
      );

      if (
        status === 401 ||
        status === 422 ||
        response.message === 'USER_NOT_FOUND'
      ) {
        // The refresh token is invalid so remove the stored tokens
        useAuthStore.getState().removeTokens();
        showAlert({
          title: 'Sesión Expirada',
          description:
            'Tu sesión ha expirado, por favor vuelve a iniciar sesión.',
          duration: 3000,
          alertType: 'error',
        });
      }

      return Promise.reject(error);
    },
  );
};

const getAuthTokens = (): ITokens | undefined => {
  const accessToken = useAuthStore.getState().accessToken;
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!accessToken && !refreshToken) {
    return;
  }

  return {
    accessToken,
    refreshToken,
  };
};

export const isTokenExpired = (token: Token): boolean => {
  if (!token) {
    return true;
  }
  const expiresIn = getExpiresIn(token);
  return !expiresIn || expiresIn <= EXPIRE_FUDGE;
};

const getTimestampFromToken = (token: Token): number | undefined => {
  const decoded = jwtDecode<JwtPayload>(token);

  return decoded.exp;
};

const getExpiresIn = (token: Token): number => {
  const expiration = getTimestampFromToken(token);

  if (!expiration) {
    return -1;
  }

  return expiration - Date.now() / 1000;
};

const refreshToken = async (
  requestRefresh: TokenRefreshRequest,
): Promise<Token> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const newTokens = await requestRefresh(refreshToken);
    if (typeof newTokens === 'object' && newTokens?.accessToken) {
      setAuthTokens(newTokens);
      return newTokens.accessToken;
    } else if (typeof newTokens === 'string') {
      await setAccessToken(newTokens);
      return newTokens;
    }
  } catch (error) {
    if (!AxiosGlobal.isAxiosError(error)) {
      throw error;
    }

    // Failed to refresh token
    const status = error.response?.status;

    if (status === 401 || status === 422) {
      // The refresh token is invalid so remove the stored tokens
      useAuthStore.getState().removeTokens();
      showAlert({
        title: 'Sesión Expirada',
        description:
          'Tu sesión ha expirado, por favor vuelve a iniciar sesión.',
        duration: 3000,
        alertType: 'error',
      });
      error.message = `Got ${status} on token refresh; clearing both auth tokens`;
    }

    throw error;
  }

  throw new Error(
    'requestRefresh must either return a string or an object with an accessToken',
  );
};

export type TokenRefreshRequest = (
  refreshToken: string,
) => Promise<Token | ITokens>;

export interface AuthTokenInterceptorConfig {
  header?: string;
  headerPrefix?: string;
  requestRefresh: TokenRefreshRequest;
}

export const authTokenInterceptor =
  ({
    header = 'Authorization',
    headerPrefix = 'Bearer ',
    requestRefresh,
  }: AuthTokenInterceptorConfig) =>
  async (requestConfig: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return requestConfig;
    }

    const authenticateRequest = (token: string | undefined) => {
      if (token) {
        requestConfig.headers = requestConfig.headers ?? {};
        // @ts-ignore
        requestConfig.headers[header] = `${headerPrefix}${token}`;
      }
      return requestConfig;
    };

    if (isRefreshing) {
      return new Promise((resolve: (token?: string) => void, reject) => {
        queue.push({resolve, reject});
      }).then(authenticateRequest);
    }

    let accessToken;

    try {
      setIsRefreshing(true);
      accessToken = await refreshTokenIfNeeded(requestRefresh);
    } catch (error) {
      declineQueue(error as Error);

      if (error instanceof Error) {
        error.message = `Unable to refresh access token for request due to token refresh error: ${error.message}`;
      }

      throw error;
    } finally {
      setIsRefreshing(false);
    }
    resolveQueue(accessToken);

    return authenticateRequest(accessToken);
  };

type RequestsQueue = {
  resolve: (token?: string) => void;
  reject: (reason?: unknown) => void;
}[];

let isRefreshing = false;
let queue: RequestsQueue = [];

export function getIsRefreshing(): boolean {
  return isRefreshing;
}

export function setIsRefreshing(newRefreshingState: boolean): void {
  isRefreshing = newRefreshingState;
}

const resolveQueue = (token?: string) => {
  queue.forEach(p => {
    p.resolve(token);
  });

  queue = [];
};

const declineQueue = (error: Error) => {
  queue.forEach(p => {
    p.reject(error);
  });

  queue = [];
};

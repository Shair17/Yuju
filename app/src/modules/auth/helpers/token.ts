import {encode as btoa, decode as atob} from 'base-64';

global.btoa = btoa;
global.atob = atob;

import {type JwtPayload, jwtDecode} from 'jwt-decode';
import {type Token} from '../types/tokens';
import {JWT_REGEX} from '../constants';

// a little time before expiration to try refresh (seconds)
const EXPIRE_FUDGE = 10;

export const getTimestampFromToken = (
  token: NonNullable<Token>,
): number | undefined => {
  const decoded = jwtDecode<JwtPayload>(token);

  return decoded?.exp;
};

export const getExpiresIn = (token: NonNullable<Token>): number => {
  const expiration = getTimestampFromToken(token);

  if (!expiration) {
    return -1;
  }

  return expiration - Date.now() / 1000;
};

export const isTokenExpired = (token: Token): boolean => {
  if (!token) {
    return true;
  }

  const expiresIn = getExpiresIn(token);

  return !expiresIn || expiresIn <= EXPIRE_FUDGE;
};

export const isValidToken = (token: string) => {
  return token.split('.').length === 3 && JWT_REGEX.test(token);
};

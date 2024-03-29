import {type Tokens} from './types/tokens';
import {type AuthStatus} from './types/status';

// default or initial tokens
export const AUTH_INITIAL_STATE: Tokens & AuthStatus = {
  accessToken: null,
  refreshToken: null,
  status: 'loading',
};

export const EMAIL_REGEX = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

export const ALT_PHONE_NUMBER_REGEX =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

export const JWT_REGEX =
  /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

export const DNI_REGEX = /^\d{8}(?:[-\s]\d{4})?$/;

export const PHONE_NUMBER_REGEX = /^[9]\d{8}$/;

export const LATITUDE_REGEX = /^((\-?|\+?)?\d+(\.\d+)?)$/;
export const LONGITUDE_REGEX = /\s*((\-?|\+?)?\d+(\.\d+)?)$/;

//export const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;

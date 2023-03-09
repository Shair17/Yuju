// Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character
// Mínimo ocho caracteres, al menos una letra mayúscula en inglés, una letra minúscula en inglés, un número y un carácter especial
export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

export const DNI_REGEX = /^\d{8}(?:[-\s]\d{4})?$/;

export const PHONE_NUMBER_REGEX = /^[9]\d{8}$/;

export const JWT_REGEX =
  /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

export const EMAIL_REGEX = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

export const LATITUDE_REGEX = /^((\-?|\+?)?\d+(\.\d+)?)$/;
export const LONGITUDE_REGEX = /\s*((\-?|\+?)?\d+(\.\d+)?)$/;

export const BEARER_SCHEME_REGEX = /^Bearer$/i;

export const CUID_REGEX = /^c[a-z0-9]{24}$/;

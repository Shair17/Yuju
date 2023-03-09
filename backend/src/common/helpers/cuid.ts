import {isString} from '../utils/string';
import {CUID_REGEX} from '../regex';

export const isCuidByRegex = (value: string) => CUID_REGEX.test(value);

export const isCuid = (val: string) => {
  if (!isString(val)) return false;

  if (val.startsWith('c')) return true;

  return false;
};

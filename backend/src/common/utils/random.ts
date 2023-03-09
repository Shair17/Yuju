import {nanoid, customAlphabet} from 'nanoid';
import {MAX_REFERRAL_CODE_LENGTH} from '../constants/app';

export const generateRandomReferralCode = (
  size: number = MAX_REFERRAL_CODE_LENGTH,
) => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

  return nanoid(size);
};

export const generateRandom = nanoid;

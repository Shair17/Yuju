import {nanoid, customAlphabet} from 'nanoid';
import {
  MAX_REFERRAL_CODE_LENGTH,
  MAX_TRACKING_RIDE_CODE_LENGTH,
} from '../constants/app';

export const generateRandomCode = (size: number = MAX_REFERRAL_CODE_LENGTH) => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

  return nanoid(size);
};

export const generateRandomReferralCode = generateRandomCode;

export const generateRandomTrackingCode = (
  size: number = MAX_TRACKING_RIDE_CODE_LENGTH,
) => {
  const nanoid = customAlphabet(
    'abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  );

  return nanoid(size);
};

export const generateRandom = nanoid;

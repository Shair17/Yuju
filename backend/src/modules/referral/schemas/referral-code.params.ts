import {Type, Static} from '@sinclair/typebox';
import {MAX_REFERRAL_CODE_LENGTH} from '../../../common/constants/app';

export const GetUserFromReferralCodeParams = Type.Object(
  {
    code: Type.String({
      minLength: MAX_REFERRAL_CODE_LENGTH,
      maxLength: MAX_REFERRAL_CODE_LENGTH,
    }),
  },
  {
    additionalProperties: false,
  },
);
export type GetUserFromReferralCodeParamsType = Static<
  typeof GetUserFromReferralCodeParams
>;

export const GetDriverFromReferralCodeParams = Type.Object(
  {
    code: Type.String({
      minLength: MAX_REFERRAL_CODE_LENGTH,
      maxLength: MAX_REFERRAL_CODE_LENGTH,
    }),
  },
  {
    additionalProperties: false,
  },
);
export type GetDriverFromReferralCodeParamsType = Static<
  typeof GetDriverFromReferralCodeParams
>;

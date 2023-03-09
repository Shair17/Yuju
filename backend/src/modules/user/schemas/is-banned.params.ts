import {Type, Static} from '@sinclair/typebox';
import {CUID_REGEX} from '../../../common/regex/index';

export const GetUserIsBannedParams = Type.Object(
  {
    userId: Type.RegEx(CUID_REGEX),
  },
  {
    additionalProperties: false,
  },
);
export type GetUserIsBannedParamsType = Static<typeof GetUserIsBannedParams>;

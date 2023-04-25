import {Type, Static} from '@sinclair/typebox';
import {CUID_REGEX} from '../../../common/regex/index';

export const GetDriverIsBannedParams = Type.Object(
  {
    driverId: Type.RegEx(CUID_REGEX),
  },
  {
    additionalProperties: false,
  },
);
export type GetDriverIsBannedParamsType = Static<
  typeof GetDriverIsBannedParams
>;

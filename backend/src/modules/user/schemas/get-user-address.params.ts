import {Type, Static} from '@sinclair/typebox';
import {CUID_REGEX} from '../../../common/regex/index';

export const GetUserAddressParams = Type.Object(
  {
    id: Type.RegEx(CUID_REGEX),
  },
  {
    additionalProperties: false,
  },
);
export type GetUserAddressParamsType = Static<typeof GetUserAddressParams>;

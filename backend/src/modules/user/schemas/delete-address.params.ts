import {Type, Static} from '@sinclair/typebox';
import {CUID_REGEX} from '../../../common/regex/index';

export const DeleteAddressParams = Type.Object(
  {
    id: Type.RegEx(CUID_REGEX),
  },
  {
    additionalProperties: false,
  },
);
export type DeleteAddressParamsType = Static<typeof DeleteAddressParams>;

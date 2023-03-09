import {Type, Static} from '@sinclair/typebox';
import {CUID_REGEX} from '../../../common/regex/index';

export const CreateUserRatingsBody = Type.Object(
  {
    value: Type.Number(),
    comment: Type.Optional(Type.String()),
    driverId: Type.RegEx(CUID_REGEX),
    // add trip id
    tripId: Type.RegEx(CUID_REGEX),
  },
  {
    additionalProperties: false,
  },
);
export type CreateUserRatingsBodyType = Static<typeof CreateUserRatingsBody>;

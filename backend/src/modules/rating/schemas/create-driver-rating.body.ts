import {Type, Static} from '@sinclair/typebox';
import {CUID_REGEX} from '../../../common/regex/index';

export const CreateDriverRatingsBody = Type.Object(
  {
    value: Type.Number(),
    comment: Type.Optional(Type.String()),
    userId: Type.RegEx(CUID_REGEX),
    // add trip id
    tripId: Type.RegEx(CUID_REGEX),
  },
  {
    additionalProperties: false,
  },
);
export type CreateDriverRatingsBodyType = Static<
  typeof CreateDriverRatingsBody
>;

import {Type, Static} from '@sinclair/typebox';
import {DNI_REGEX, PHONE_NUMBER_REGEX} from '../../../common/regex/index';

export const UpdateMeBody = Type.Object(
  {
    avatar: Type.Optional(Type.String()),
    email: Type.String({format: 'email'}),
    dni: Type.RegEx(DNI_REGEX),
    phoneNumber: Type.RegEx(PHONE_NUMBER_REGEX),
    summary: Type.String(),
    birthDate: Type.String(),
  },
  {
    additionalProperties: false,
  },
);
export type UpdateMeBodyType = Static<typeof UpdateMeBody>;

import {Type, Static} from '@sinclair/typebox';
import {DNI_REGEX, PHONE_NUMBER_REGEX} from '../../../common/regex/index';

export const CreateMeBody = Type.Object(
  {
    avatar: Type.Optional(Type.String()),
    email: Type.String({format: 'email'}),
    dni: Type.RegEx(DNI_REGEX),
    phoneNumber: Type.RegEx(PHONE_NUMBER_REGEX),
    birthDate: Type.String(),
    referredByCode: Type.Optional(Type.String()),
  },
  {
    additionalProperties: false,
  },
);
export type CreateMeBodyType = Static<typeof CreateMeBody>;

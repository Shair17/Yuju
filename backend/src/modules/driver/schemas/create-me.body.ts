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

    summary: Type.String({minLength: 10, maxLength: 100}),

    //# Vehicle
    // license: Type.Array(Type.String()),
    // propertyCard: Type.Array(Type.String()),
    //circulationCard: Type.Array(Type.String()),
    // technicalReview: Type.Array(Type.String()),
    // dniPhotos: Type.Array(Type.String()),
    vehiclePhotos: Type.Array(Type.String(), {
      minItems: 2,
      maxItems: 2,
    }),
    // soat: Type.Array(Type.String()),

    plate: Type.String({minLength: 6, maxLength: 6}),
  },
  {
    additionalProperties: false,
  },
);
export type CreateMeBodyType = Static<typeof CreateMeBody>;

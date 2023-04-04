import {Type, Static} from '@sinclair/typebox';
import {LocationTag} from '@prisma/client';

export const CreateAddressBody = Type.Object(
  {
    name: Type.String(),
    address: Type.String(),
    zip: Type.String(),
    city: Type.String(),
    tag: Type.Enum(LocationTag),
    latitude: Type.Number(),
    longitude: Type.Number(),
  },
  {
    additionalProperties: false,
  },
);
export type CreateAddressBodyType = Static<typeof CreateAddressBody>;

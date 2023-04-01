import {Type, Static} from '@sinclair/typebox';
import {LocationTag} from '@prisma/client';

export const CreateAddressBody = Type.Object(
  {
    name: Type.String(),
    address: Type.Optional(Type.String()),
    street: Type.Optional(Type.String()),
    zip: Type.Optional(Type.String()),
    city: Type.Optional(Type.String()),
    tag: Type.Enum(LocationTag),
    latitude: Type.Number(),
    longitude: Type.Number(),
  },
  {
    additionalProperties: false,
  },
);
export type CreateAddressBodyType = Static<typeof CreateAddressBody>;

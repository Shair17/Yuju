import {Type, Static} from '@sinclair/typebox';

export const CreateUserBody = Type.Object(
  {
    facebookId: Type.String(),
    facebookAccessToken: Type.String(),
    name: Type.String(),
  },
  {
    additionalProperties: false,
  },
);
export type CreateUserBodyType = Static<typeof CreateUserBody>;

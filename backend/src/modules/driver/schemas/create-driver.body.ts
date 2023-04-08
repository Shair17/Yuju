import {Type, Static} from '@sinclair/typebox';

export const CreateDriverBody = Type.Object(
  {
    facebookId: Type.String(),
    facebookAccessToken: Type.String(),
    name: Type.String(),
  },
  {
    additionalProperties: false,
  },
);
export type CreateDriverBodyType = Static<typeof CreateDriverBody>;

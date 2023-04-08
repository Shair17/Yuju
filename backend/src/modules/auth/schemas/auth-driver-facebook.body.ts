import {Type, Static} from '@sinclair/typebox';

export const LogInDriverWithFacebookBody = Type.Object(
  {
    accessToken: Type.String(),
    userID: Type.String(),
  },
  {
    additionalProperties: false,
  },
);
export type LogInDriverWithFacebookBodyType = Static<
  typeof LogInDriverWithFacebookBody
>;

export const RefreshDriverFacebookTokenBody = Type.Object(
  {
    refreshToken: Type.String(),
  },
  {
    additionalProperties: false,
  },
);
export type RefreshDriverFacebookTokenBodyType = Static<
  typeof RefreshDriverFacebookTokenBody
>;

import {Type, Static} from '@sinclair/typebox';

export const LogInUserWithFacebookBody = Type.Object(
  {
    accessToken: Type.String(),
    userID: Type.String(),
  },
  {
    additionalProperties: false,
  },
);
export type LogInUserWithFacebookBodyType = Static<
  typeof LogInUserWithFacebookBody
>;

export const RefreshUserFacebookTokenBody = Type.Object(
  {
    refreshToken: Type.String(),
  },
  {
    additionalProperties: false,
  },
);
export type RefreshUserFacebookTokenBodyType = Static<
  typeof RefreshUserFacebookTokenBody
>;

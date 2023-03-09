import {Type, Static} from '@sinclair/typebox';

export const LogInUserWithFacebookResponse = Type.Object(
  {
    accessToken: Type.String(),
    refreshToken: Type.String(),
    isNew: Type.Boolean(),
  },
  {
    additionalProperties: false,
  },
);
export type LogInUserWithFacebookResponseType = Static<
  typeof LogInUserWithFacebookResponse
>;

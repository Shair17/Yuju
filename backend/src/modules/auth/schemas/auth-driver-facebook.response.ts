import {Type, Static} from '@sinclair/typebox';

export const LogInDriverWithFacebookResponse = Type.Object(
  {
    accessToken: Type.String(),
    refreshToken: Type.String(),
    isNew: Type.Boolean(),
  },
  {
    additionalProperties: false,
  },
);
export type LogInDriverWithFacebookResponseType = Static<
  typeof LogInDriverWithFacebookResponse
>;

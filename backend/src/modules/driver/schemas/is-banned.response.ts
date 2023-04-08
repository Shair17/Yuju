import {Type, Static} from '@sinclair/typebox';

export const GetDriverIsBannedResponse = Type.Object(
  {
    isBanned: Type.Boolean(),
    banReason: Type.Union([Type.Null(), Type.String()]),
    // banReason: Type.Optional(Type.String()),
  },
  {
    additionalProperties: false,
  },
);
export type GetDriverIsBannedResponseType = Static<
  typeof GetDriverIsBannedResponse
>;

import {Type, Static} from '@sinclair/typebox';

export const CreateUserReportBugBody = Type.Object({
  title: Type.String(),
  description: Type.String(),
  extra: Type.Optional(Type.String()),
});

export type CreateUserReportBugBodyType = Static<
  typeof CreateUserReportBugBody
>;

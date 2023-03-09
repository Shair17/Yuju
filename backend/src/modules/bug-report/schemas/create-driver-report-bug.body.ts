import {Type, Static} from '@sinclair/typebox';

export const CreateDriverReportBugBody = Type.Object({
  title: Type.String(),
  description: Type.String(),
  extra: Type.Optional(Type.String()),
});

export type CreateDriverReportBugBodyType = Static<
  typeof CreateDriverReportBugBody
>;

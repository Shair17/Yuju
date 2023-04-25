import z from 'zod';

export type BugReportFormDataValues = {
  title: string;
  description: string;
  extra?: string;
};

export const BugReportSchema = z.object({
  title: z.string(),
  description: z.string(),
  extra: z.optional(z.string()),
});

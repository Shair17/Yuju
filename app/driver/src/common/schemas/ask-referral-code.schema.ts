import z from 'zod';

export type AskReferralCodeFormDataValues = {
  referralCode?: string;
};

export const askReferralCodeSchema = z.object({
  referralCode: z.optional(z.string().min(6).max(6)),
});

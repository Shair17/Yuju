import z from 'zod';

export type LocationInformationType = {
  name: string;
  address: string;
  zip: string;
  city: string;
};

export const LocationInformationSchema = z.object({
  name: z.string(),
  address: z.string(),
  zip: z.string(),
  city: z.string(),
});

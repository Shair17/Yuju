import z from 'zod';

export type EditVehicleFormDataValues = {
  plate: string;
};

export const EditVehicleSchemaValidator = z.object({
  plate: z.string().min(6).max(6),
});

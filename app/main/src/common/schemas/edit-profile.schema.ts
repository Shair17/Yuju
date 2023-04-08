import z from 'zod';
import {DNI_REGEX} from '../regex';

export type EditProfileFormDataValues = {
  email: string;
  dni: string;
  phone: string;
};

export const EditProfileSchemaValidator = z.object({
  email: z.string().email({message: 'Correo electrónico inválido'}),
  dni: z.string().min(8).max(8).regex(DNI_REGEX, {message: 'DNI inválido'}),
  phone: z.string().min(9).max(9, {message: 'Número de celular inválido'}),
});

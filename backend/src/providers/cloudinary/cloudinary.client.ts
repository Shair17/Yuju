import {v2 as cloudinary} from 'cloudinary';
import {
  CloudinaryClient,
  CloudinaryClientOptions,
} from './cloudinary.interface';

export const createCloudinaryClient = (
  options: CloudinaryClientOptions,
): CloudinaryClient => cloudinary.config(options);

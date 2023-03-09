import {ConfigSchemaType} from './schema.config';

export type Config = string | number | boolean;
export type ConfigKey = keyof ConfigSchemaType;
export type ConfigKeyOrString = ConfigKey | string;

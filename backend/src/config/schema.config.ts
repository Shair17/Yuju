import {Type, Static} from '@sinclair/typebox';

// NODE_ENV -> 'development', 'production', 'test', 'provision'

export type ConfigSchemaType = Static<typeof ConfigSchema>;

const ConfigSchema = Type.Strict(
  Type.Object(
    {
      PORT: Type.Number({
        default: 3000,
      }),

      NODE_ENV: Type.String({
        default: 'development',
      }),

      DATABASE_URL: Type.String(),
      MONGODB_DATABASE_URL: Type.String(),

      JWT_USER_SECRET: Type.String(),
      JWT_USER_SECRET_EXPIRES_IN: Type.String(),
      JWT_USER_REFRESH_SECRET: Type.String(),
      JWT_USER_REFRESH_SECRET_EXPIRES_IN: Type.String(),
      JWT_DRIVER_SECRET: Type.String(),
      JWT_DRIVER_SECRET_EXPIRES_IN: Type.String(),
      JWT_DRIVER_REFRESH_SECRET: Type.String(),
      JWT_DRIVER_REFRESH_SECRET_EXPIRES_IN: Type.String(),

      MAILER_TRANSPORTER_HOST: Type.String(),
      MAILER_TRANSPORTER_PORT: Type.Number(),
      MAILER_TRANSPORTER_SECURE: Type.Boolean(),
      MAILER_TRANSPORTER_USER: Type.String(),
      MAILER_TRANSPORTER_PASS: Type.String(),

      CLOUDINARY_CLOUD_NAME: Type.String(),
      CLOUDINARY_API_KEY: Type.String(),
      CLOUDINARY_API_SECRET: Type.String(),

      TWILIO_ACCOUNT_SID: Type.String(),
      TWILIO_AUTH_TOKEN: Type.String(),
    },
    {
      additionalProperties: false,
    },
  ),
);

export default ConfigSchema;

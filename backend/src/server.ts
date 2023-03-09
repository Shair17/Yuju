import 'reflect-metadata';

import {join} from 'path';
import {cwd} from 'process';
import fastify, {FastifyServerOptions} from 'fastify';
import EnvPlugin from '@fastify/env';
import {bootstrap as bootstrapFastifyControllersPlugin} from 'fastify-decorators';
import RateLimitPlugin from '@fastify/rate-limit';
// import CorsPlugin from '@fastify/cors';
// import HelmetPlugin from '@fastify/helmet';
import SocketIOPlugin from 'fastify-socket.io';
import CompressPlugin from '@fastify/compress';
// import PrismaPlugin from './common/plugins/prisma';
import GracefulExitPlugin from '@mgcrea/fastify-graceful-exit';
// import ShutdownPlugin from './common/plugins/shutdown';
import NoIconPlugin from './common/plugins/no-icon';
import ConfigSchema from './config/schema.config';
import defaultServerConfig from './config/server.config';
import {AppModule} from './app.module';
import {AuthTokenPayload} from './interfaces/tokens';

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthTokenPayload | null;
    driver: AuthTokenPayload | null;
  }
}

export default async function Server(
  config: FastifyServerOptions = defaultServerConfig,
) {
  const app = fastify(config);

  app.register(EnvPlugin, {
    dotenv: {
      path: join(cwd(), '.env'),
    },
    schema: ConfigSchema,
  });
  app.register(GracefulExitPlugin);
  app.register(NoIconPlugin);
  app.register(CompressPlugin);
  // app.register(HelmetPlugin, {
  //   global: true,
  //   hidePoweredBy: true,
  // });
  app.register(RateLimitPlugin, {
    max: 100,
    timeWindow: '1 minute',
  });
  // app.register(CorsPlugin);
  [
    'user',
    'driver',
    //'admin'
  ].forEach(entity => {
    app.decorateRequest(entity, null);
  });
  app.register(SocketIOPlugin, {
    serveClient: false,
    cors: {
      origin: '*',
    },
  });
  app.register(bootstrapFastifyControllersPlugin, {
    controllers: [...AppModule],
  });

  return app;
}

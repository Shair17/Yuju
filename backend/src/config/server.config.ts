import type {FastifyServerOptions} from 'fastify';

const config: FastifyServerOptions = {
  logger: true,
  ignoreTrailingSlash: true,
  disableRequestLogging: true,
};

export default config;

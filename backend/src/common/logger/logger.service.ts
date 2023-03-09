import {FastifyInstance} from 'fastify';
import {
  Service,
  getInstanceByToken,
  FastifyInstanceToken,
} from 'fastify-decorators';
import {LOGGER_SERVICE_TOKEN} from './logger.token';

@Service(LOGGER_SERVICE_TOKEN)
export class LoggerService {
  private readonly fastify =
    getInstanceByToken<FastifyInstance>(FastifyInstanceToken);

  info(msg: string, ...args: unknown[]) {
    this.fastify.log.info(msg, ...args);
  }

  error(msg: string, ...args: unknown[]) {
    this.fastify.log.error(msg, ...args);
  }

  debug(msg: string, ...args: unknown[]) {
    this.fastify.log.debug(msg, ...args);
  }

  warn(msg: string, ...args: unknown[]) {
    this.fastify.log.warn(msg, ...args);
  }

  trace(msg: string, ...args: unknown[]) {
    this.fastify.log.trace(msg, ...args);
  }

  fatal(msg: string, ...args: unknown[]) {
    this.fastify.log.fatal(msg, ...args);
  }
}

import type {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify';

export type Context = {
  request: FastifyRequest;
  reply: FastifyReply;
  app: FastifyInstance;
};

import {FastifyPluginAsync} from 'fastify';
import fp from 'fastify-plugin';

const noIconPlugin: FastifyPluginAsync = fp(async (server, _) => {
  server.get('/favicon.ico', (_, reply) => {
    reply.code(404).send();
  });
});

export default noIconPlugin;

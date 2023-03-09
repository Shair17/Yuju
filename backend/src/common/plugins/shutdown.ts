import {FastifyPluginAsync} from 'fastify';
import fp from 'fastify-plugin';

const shutdownPlugin: FastifyPluginAsync = fp(async (server, _) => {
  process.on('SIGINT', () => {
    server.close();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    server.close();
    process.exit(0);
  });
});

export default shutdownPlugin;

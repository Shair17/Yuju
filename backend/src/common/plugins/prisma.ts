import {FastifyPluginAsync} from 'fastify';
import fp from 'fastify-plugin';
import {PrismaClient} from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, _) => {
  const isDev = process.env.MODE_ENV !== 'production';

  const prisma = new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
    // log: ['error', 'warn', 'info', 'query'],
  });

  await prisma.$connect();

  server.log.info(`Prisma has established the connection to the database.`);

  server.decorate('prisma', prisma);

  server.addHook('onClose', async server => {
    await server.prisma.$disconnect();

    server.log.info(`Prisma has been disconnected from the database.`);
  });
});

export default prismaPlugin;

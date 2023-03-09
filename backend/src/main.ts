import buildServer from './server';
import {serverHost} from './common/constants/app';

async function bootstrap() {
  const app = await buildServer();

  const port = app.config.PORT;

  await app.listen({
    port,
    host: serverHost,
  });
}

bootstrap().catch(console.error);

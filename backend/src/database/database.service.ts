import {Service, Initializer, Destructor, Inject} from 'fastify-decorators';
import {PrismaClient} from '@prisma/client';
import {OnModuleDestroy, OnModuleInit} from '../interfaces/module';
import {LoggerService} from '../common/logger/logger.service';

@Service('DatabaseServiceToken')
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  @Inject(LoggerService)
  private readonly loggerService: LoggerService;

  @Initializer()
  async onModuleInit() {
    await this.$connect();
    this.loggerService.info(
      `Prisma Service has established the connection to the database`,
    );
  }

  @Destructor()
  async onModuleDestroy() {
    await this.$disconnect();
    this.loggerService.info(
      `Prisma Service has been disconnected from the database`,
    );
  }
}

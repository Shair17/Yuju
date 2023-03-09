import {Service, Initializer, Destructor, Inject} from 'fastify-decorators';
import {OnModuleInit, OnModuleDestroy} from '../interfaces/module';
import {LoggerService} from '../common/logger/logger.service';
import {ConfigService} from '../config/config.service';
import * as mongoose from 'mongoose';

mongoose.set('strictQuery', false);

@Service('MongoDBServiceToken')
export class MongoDBService implements OnModuleInit, OnModuleDestroy {
  @Inject(LoggerService)
  private readonly loggerService: LoggerService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  private db: typeof mongoose;

  @Initializer()
  async onModuleInit() {
    this.db = await mongoose.connect(
      this.configService.getOrThrow('MONGODB_DATABASE_URL'),
    );

    this.loggerService.info(
      `Mongoose Service has established the connection to the database`,
    );
  }

  @Destructor()
  async onModuleDestroy() {
    await this.db.disconnect();

    this.loggerService.info(
      `Mongoose Service has established the connection to the database`,
    );
  }

  public get client() {
    return this.db;
  }
}

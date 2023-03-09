import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from './database/database.service';
import {RealTimeService} from './providers/realtime/realtime.service';
import {
  serverName,
  serverVersion,
  appName,
  appVersion,
  appDeveloper,
  appUpdateMessage,
} from './common/constants/app';

@Service('AppServiceToken')
export class AppService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(RealTimeService)
  private readonly realTimeService: RealTimeService;

  async _dropDatabase() {
    const res = await Promise.all([
      await this.databaseService.user.deleteMany(),
      await this.databaseService.profile.deleteMany(),
      await this.databaseService.driver.deleteMany(),
      await this.databaseService.availability.deleteMany(),
    ]);

    return res;
  }

  getApp() {
    return {
      server_name: serverName,
      server_version: serverVersion,
      app_name: appName,
      app_version: appVersion,
      app_developer: appDeveloper,
      // app_update_needed: appUpdateNeeded,
      app_update_message: appUpdateMessage,
      date: new Date(),
    };
  }
}

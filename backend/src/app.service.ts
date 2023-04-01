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
  PROFIT_PERCENTAGE_PER_TRIP as DEFAULT_PROFIT_PERCENTAGE_PER_TRIP,
} from './common/constants/app';
import fs from 'fs/promises';
import path, {join} from 'path';
import {ConfigService} from './config/config.service';
import {HttpService} from './providers/http/http.service';
import {cwd} from 'process';

@Service('AppServiceToken')
export class AppService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(RealTimeService)
  private readonly realTimeService: RealTimeService;

  async _dropDatabase() {
    const res = await Promise.all([
      await this.databaseService.user.deleteMany(),
      await this.databaseService.profile.deleteMany(),
      await this.databaseService.driver.deleteMany(),
      await this.databaseService.availability.deleteMany(),
      await this.databaseService.bugReport.deleteMany(),
      await this.databaseService.trip.deleteMany(),
      await this.databaseService.rating.deleteMany(),
      await this.databaseService.location.deleteMany(),
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

  async getDetails() {
    const appProfits = await fs.readFile(
      join(cwd(), 'public/essentials/app.profits.json'),
      'utf-8',
    );
    const data = JSON.parse(appProfits);

    console.log(data);

    return {
      profitPercentagePerTrip: null,
    };
  }
}

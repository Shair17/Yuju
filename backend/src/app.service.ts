import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from './database/database.service';
import {RealTimeService} from './providers/realtime/realtime.service';
import {QueueService} from './providers/realtime/queue.service';
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

  @Inject(QueueService)
  private readonly queueService: QueueService;

  async _dropTrips() {
    const trips = await this.databaseService.trip.findMany({
      select: {
        id: true,
      },
    });

    for (const {id} of trips) {
      this.queueService.deleteFromInRidePendingQueue(id);
      this.queueService.deleteFromInRideQueue(id);
    }

    await this.databaseService.trip.deleteMany();

    this.realTimeService.client
      .of('/users')
      .emit('PASSENGER_IN_RIDE_PENDING', null);

    return 'ok';
  }

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

  async getApp() {
    return {
      server_name: serverName,
      server_version: serverVersion,
      app_name: appName,
      app_version: appVersion,
      app_developer: appDeveloper,
      // app_update_needed: appUpdateNeeded,
      app_update_message: appUpdateMessage,
      date: new Date(),
      ts: Date.now(),
    };
  }
}

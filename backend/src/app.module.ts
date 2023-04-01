import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {AppController} from './app.controller';
import {AuthModule} from './modules/auth/auth.module';
import {DriverModule} from './modules/driver/driver.module';
import {RatingModule} from './modules/rating/rating.module';
import {TripModule} from './modules/trip/trip.module';
import {UserModule} from './modules/user/user.module';
import {VehicleModule} from './modules/vehicle/vehicle.module';
import {BugReportModule} from './modules/bug-report/bug-report.module';
import {NotificationModule} from './modules/notification/notification.module';

export const AppModule: Constructor<unknown>[] = [
  AppController,

  ...AuthModule,
  ...DriverModule,
  ...RatingModule,
  ...TripModule,
  ...UserModule,
  ...VehicleModule,
  ...BugReportModule,
  ...NotificationModule,
];

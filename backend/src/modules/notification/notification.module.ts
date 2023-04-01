import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {NotificationController} from './notification.controller';

export const NotificationModule: Constructor<unknown>[] = [
  NotificationController,
];

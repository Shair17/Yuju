import {Service} from 'fastify-decorators';
import {notifications} from './notification.data';

@Service('NotificationServiceToken')
export class NotificationService {
  async getNotifications() {
    return notifications;
  }
}

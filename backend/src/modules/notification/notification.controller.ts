import {Controller, GET, Inject} from 'fastify-decorators';
import {NotificationService} from './notification.service';
import {
  hasBearerToken,
  userIsAuthenticated,
} from '../../guards/auth-guard.hook';

@Controller('/v1/notifications')
export class NotificationController {
  @Inject(NotificationService)
  private readonly notificationService: NotificationService;

  @GET('/', {
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async getNotifications() {
    return this.notificationService.getNotifications();
  }
}

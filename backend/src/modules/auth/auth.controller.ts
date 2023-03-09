import {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, POST, DELETE, Inject} from 'fastify-decorators';
import {AuthService} from './auth.service';
import {
  LogInUserWithFacebookBody,
  LogInUserWithFacebookBodyType,
  RefreshUserFacebookTokenBody,
  RefreshUserFacebookTokenBodyType,
} from './schemas/auth-user-facebook.body';
import {
  LogInDriverWithFacebookBody,
  LogInDriverWithFacebookBodyType,
} from './schemas/auth-driver-facebook.body';
import {LogInUserWithFacebookResponse} from './schemas/auth-user-facebook.response';
import {LogInDriverWithFacebookResponse} from './schemas/auth-driver-facebook.response';
import {
  hasBearerToken,
  userIsAuthenticated,
} from '../../guards/auth-guard.hook';

@Controller('/v1/auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  /** User Auth */
  @POST('/user/facebook', {
    schema: {
      body: LogInUserWithFacebookBody,
      response: {
        '2xx': LogInUserWithFacebookResponse,
      },
    },
  })
  async logInUserWithFacebook(
    request: Request<{
      Body: LogInUserWithFacebookBodyType;
    }>,
    reply: Reply,
  ) {
    return this.authService.logInUserWithFacebook(request.body);
  }

  @POST('/user/facebook/refresh', {
    schema: {
      body: RefreshUserFacebookTokenBody,
    },
  })
  async refreshUserFacebookToken(
    request: Request<{
      Body: RefreshUserFacebookTokenBodyType;
    }>,
    reply: Reply,
  ) {
    return this.authService.refreshUserFacebookToken(request.body);
  }

  @DELETE('/user/facebook/logout', {
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async logOutUserFromFacebook(request: Request, reply: Reply) {
    reply.removeHeader('authorization');
    return this.authService.logOutUserFromFacebook(request.user?.id!);
  }

  /** Driver Auth */
  @POST('/driver/facebook', {
    schema: {
      body: LogInDriverWithFacebookBody,
      response: {
        '2xx': LogInDriverWithFacebookResponse,
      },
    },
  })
  async logInDriverWithFacebook(
    request: Request<{
      Body: LogInDriverWithFacebookBodyType;
    }>,
    reply: Reply,
  ) {
    return this.authService.logInDriverWithFacebook(request.body);
  }

  @POST('/driver/facebook/refresh')
  async refreshDriverFacebookToken(request: Request, reply: Reply) {
    return this.authService.refreshDriverFacebookToken(request.body);
  }

  @DELETE('/driver/facebook/logout')
  async logOutDriverFromFacebook(request: Request, reply: Reply) {
    reply.removeHeader('authorization');
    return this.authService.logOutDriverFromFacebook(request.driver?.id!);
  }
}

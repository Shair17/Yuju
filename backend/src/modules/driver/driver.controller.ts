import {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, GET, Inject, POST, PUT} from 'fastify-decorators';
import {DriverService} from './driver.service';
import {
  hasBearerToken,
  driverIsAuthenticated,
} from '../../guards/auth-guard.hook';
import {
  GetDriverIsBannedParams,
  GetDriverIsBannedParamsType,
} from './schemas/is-banned.params';
import {
  GetDriverIsBannedResponse,
  GetDriverIsBannedResponseType,
} from './schemas/is-banned.response';
import {CreateMeBody, CreateMeBodyType} from './schemas/create-me.body';
import {UpdateMeBody, UpdateMeBodyType} from './schemas/update-me.body';

@Controller('/v1/drivers')
export class DriverController {
  @Inject(DriverService)
  private readonly driverService: DriverService;

  @GET('/')
  async getUsers() {
    return this.driverService.getDrivers();
  }

  @GET('/count', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async getCount(request: Request, reply: Reply) {
    return this.driverService.count();
  }

  @GET('/im-new', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async getIsNew(request: Request, reply: Reply) {
    return this.driverService.isNew(request.user?.id!);
  }

  @GET('/:driverId/is-banned', {
    schema: {
      params: GetDriverIsBannedParams,
      response: {
        '2xx': GetDriverIsBannedResponse,
      },
    },
  })
  async getIsBanned(
    request: Request<{
      Params: GetDriverIsBannedParamsType;
      Reply: GetDriverIsBannedResponseType;
    }>,
    reply: Reply,
  ) {
    return this.driverService.isBanned(request.params.userId);
  }

  @GET('/me', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async getMe(request: Request, reply: Reply) {
    return this.driverService.getMe(request.user?.id!);
  }

  // For create driver profile when is new driver
  @POST('/me', {
    schema: {
      body: CreateMeBody,
    },
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async createMe(
    request: Request<{
      Body: CreateMeBodyType;
    }>,
    reply: Reply,
  ) {
    return this.driverService.createMe(request.driver?.id!, request.body);
  }

  // For update driver profile when it's already created
  @PUT('/me', {
    schema: {
      body: UpdateMeBody,
    },
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async updateMe(
    request: Request<{
      Body: UpdateMeBodyType;
    }>,
    reply: Reply,
  ) {
    return this.driverService.updateMe(request.driver?.id!, request.body);
  }
}

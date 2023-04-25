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
import {
  GetMyVehicleQuery,
  GetMyVehicleQueryType,
} from './schemas/get-my-vehicle.query';
import {
  GetMyEarningsQuery,
  GetMyEarningsQueryType,
} from './schemas/get-earnings.query';

@Controller('/v1/drivers')
export class DriverController {
  @Inject(DriverService)
  private readonly driverService: DriverService;

  @GET('/')
  async getDrivers() {
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
    return this.driverService.isNew(request.driver?.id!);
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
    return this.driverService.isBanned(request.params.driverId);
  }

  @GET('/im-active', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async getImActive(request: Request, reply: Reply) {
    return this.driverService.getImActive(request.driver?.id!);
  }

  @GET('/me', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async getMe(request: Request, reply: Reply) {
    return this.driverService.getMe(request.driver?.id!);
  }

  @GET('/me/vehicle', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
    schema: {
      querystring: GetMyVehicleQuery,
    },
  })
  async getVehicle(
    request: Request<{
      Querystring: GetMyVehicleQueryType;
    }>,
    reply: Reply,
  ) {
    return this.driverService.getVehicle(request.driver?.id!, request.query);
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

  @GET('/earnings/total', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async getMyTotalEarnings(request: Request, reply: Reply) {
    return this.driverService.getMyTotalEarnings(request.driver?.id!);
  }

  @GET('/earnings', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
    schema: {
      querystring: GetMyEarningsQuery,
    },
  })
  async getMyEarnings(
    request: Request<{
      Querystring: GetMyEarningsQueryType;
    }>,
    reply: Reply,
  ) {
    return this.driverService.getMyEarnings(request.driver?.id!, request.query);
  }
}

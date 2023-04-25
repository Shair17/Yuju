import {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, GET, Inject} from 'fastify-decorators';
import {TripService} from './trip.service';
import {
  driverIsAuthenticated,
  hasBearerToken,
  userIsAuthenticated,
} from '../../guards/auth-guard.hook';
import {
  GetMeetYourDriverParams,
  GetMeetYourDriverParamsType,
} from './schemas/meet-your-driver.params.schema';
import {
  GetUserTripsQuery,
  GetUserTripsQueryType,
} from './schemas/get-user-trips.query';
import {
  GetDriverTripsQuery,
  GetDriverTripsQueryType,
} from './schemas/get-driver-trips.query';

@Controller('/v1/trips')
export class TripController {
  @Inject(TripService)
  private readonly tripService: TripService;

  @GET('/users', {
    onRequest: [hasBearerToken, userIsAuthenticated],
    schema: {
      querystring: GetUserTripsQuery,
    },
  })
  async getUserTrips(
    request: Request<{
      Querystring: GetUserTripsQueryType;
    }>,
    reply: Reply,
  ) {
    return this.tripService.getUserTrips(request.user?.id!, request.query);
  }

  @GET('/drivers', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
    schema: {
      querystring: GetDriverTripsQuery,
    },
  })
  async getDriverTrips(
    request: Request<{
      Querystring: GetDriverTripsQueryType;
    }>,
    reply: Reply,
  ) {
    return this.tripService.getDriverTrips(request.driver?.id!, request.query);
  }

  @GET('/meet-your-driver/:driverId', {
    onRequest: [hasBearerToken, userIsAuthenticated],
    schema: {
      params: GetMeetYourDriverParams,
    },
  })
  async getMeeetYourDriver(
    request: Request<{
      Params: GetMeetYourDriverParamsType;
    }>,
    reply: Reply,
  ) {
    return this.tripService.getMeeetYourDriver(
      request.user?.id!,
      request.params,
    );
  }
}

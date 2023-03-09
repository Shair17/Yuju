import {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, GET, Inject} from 'fastify-decorators';
import {TripService} from './trip.service';
import {
  hasBearerToken,
  userIsAuthenticated,
} from '../../guards/auth-guard.hook';
import {
  GetMeetYourDriverParams,
  GetMeetYourDriverParamsType,
} from './schemas/meet-your-driver.params.schema';

@Controller('/v1/trips')
export class TripController {
  @Inject(TripService)
  private readonly tripService: TripService;

  @GET('/:tripId/meet-your-driver/:driverId', {
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

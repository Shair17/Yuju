import {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, GET, POST, Inject} from 'fastify-decorators';
import {RatingService} from './rating.service';
import {
  CreateUserRatingsBody,
  CreateUserRatingsBodyType,
} from './schemas/create-user-rating.body';
import {
  CreateDriverRatingsBody,
  CreateDriverRatingsBodyType,
} from './schemas/create-driver-rating.body';
import {
  driverIsAuthenticated,
  hasBearerToken,
  userIsAuthenticated,
} from '../../guards/auth-guard.hook';
import {
  GetUserRatingsQuery,
  GetUserRatingsQueryType,
} from './schemas/get-user-rating.query';
import {
  GetDriverRatingsQueryType,
  GetDriverRatingsQuery,
} from './schemas/get-driver-rating.query';

@Controller('/v1/ratings')
export class RatingController {
  @Inject(RatingService)
  private readonly ratingService: RatingService;

  @GET('/users/count', {
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async getUserCount(request: Request, reply: Reply) {
    return this.ratingService.getMyUsersCount(request.user?.id!);
  }

  @GET('/drivers/count', {
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async getDriverCount(request: Request, reply: Reply) {
    return this.ratingService.getMyDriversCount(request.driver?.id!);
  }

  @GET('/users', {
    onRequest: [hasBearerToken, userIsAuthenticated],
    schema: {
      querystring: GetUserRatingsQuery,
    },
  })
  async getUserRatings(
    request: Request<{
      Querystring: GetUserRatingsQueryType;
    }>,
    reply: Reply,
  ) {
    return this.ratingService.getUserRatings(request.user?.id!, request.query);
  }

  @GET('/drivers', {
    onRequest: [hasBearerToken, userIsAuthenticated],
    schema: {
      querystring: GetDriverRatingsQuery,
    },
  })
  async getDriverRatings(
    request: Request<{
      Querystring: GetDriverRatingsQueryType;
    }>,
    reply: Reply,
  ) {
    return this.ratingService.getDriverRatings(
      request.user?.id!,
      request.query,
    );
  }

  @POST('/users', {
    onRequest: [hasBearerToken, userIsAuthenticated],
    schema: {
      body: CreateUserRatingsBody,
    },
  })
  async createUserRating(
    request: Request<{
      Body: CreateUserRatingsBodyType;
    }>,
    reply: Reply,
  ) {
    return this.ratingService.createUserRating(request.user?.id!, request.body);
  }

  @POST('/drivers', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
    schema: {
      body: CreateDriverRatingsBody,
    },
  })
  async createDriverRating(
    request: Request<{
      Body: CreateDriverRatingsBodyType;
    }>,
    reply: Reply,
  ) {
    return this.ratingService.createDriverRating(
      request.driver?.id!,
      request.body,
    );
  }
}

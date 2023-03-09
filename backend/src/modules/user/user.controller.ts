import {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, GET, POST, PUT, DELETE, Inject} from 'fastify-decorators';
import {CreateMeBody, CreateMeBodyType} from './schemas/create-me.body';
import {UpdateMeBody, UpdateMeBodyType} from './schemas/update-me.body';
import {UserService} from './user.service';
import {
  hasBearerToken,
  userIsAuthenticated,
} from '../../guards/auth-guard.hook';
import {
  GetUserFromReferralCodeParams,
  GetUserFromReferralCodeParamsType,
} from './schemas/referral-code.params';
import {
  GetUserIsBannedParams,
  GetUserIsBannedParamsType,
} from './schemas/is-banned.params';
import {
  GetIsBannedResponse,
  GetIsBannedResponseType,
} from './schemas/is-banned.response';

@Controller('/v1/users')
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @GET('/')
  async getUsers() {
    return this.userService.getUsers();
  }

  @GET('/count', {
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async getCount(request: Request, reply: Reply) {
    return this.userService.count();
  }

  @GET('/referrals/:code', {
    schema: {
      params: GetUserFromReferralCodeParams,
    },
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async getUserFromReferralCode(
    request: Request<{
      Params: GetUserFromReferralCodeParamsType;
    }>,
    reply: Reply,
  ) {
    return this.userService.getUserFromReferralCode(
      request.user?.id!,
      request.params.code,
    );
  }

  @GET('/:userId/is-banned', {
    schema: {
      params: GetUserIsBannedParams,
      response: {
        '2xx': GetIsBannedResponse,
      },
    },
  })
  async getIsBanned(
    request: Request<{
      Params: GetUserIsBannedParamsType;
      Reply: GetIsBannedResponseType;
    }>,
    reply: Reply,
  ) {
    return this.userService.isBanned(request.params.userId);
  }

  @GET('/me/is-new', {
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async getIsNew(request: Request, reply: Reply) {
    return this.userService.isNew(request.user?.id!);
  }

  @GET('/me', {
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async getMe(request: Request, reply: Reply) {
    return this.userService.getMe(request.user?.id!);
  }

  // For create user profile when is new user
  @POST('/me', {
    schema: {
      body: CreateMeBody,
    },
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async createMe(
    request: Request<{
      Body: CreateMeBodyType;
    }>,
    reply: Reply,
  ) {
    return this.userService.createMe(request.user?.id!, request.body);
  }

  // For update user profile when it's already created
  @PUT('/me', {
    schema: {
      body: UpdateMeBody,
    },
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async updateMe(
    request: Request<{
      Body: UpdateMeBodyType;
    }>,
    reply: Reply,
  ) {
    return this.userService.updateMe(request.user?.id!, request.body);
  }

  @GET('/me/referrals', {
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async getReferrals(request: Request, reply: Reply) {
    return this.userService.getReferrals(request.user?.id!);
  }
}

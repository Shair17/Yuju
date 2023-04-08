import {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, GET, POST, PUT, DELETE, Inject} from 'fastify-decorators';
import {
  driverIsAuthenticated,
  hasBearerToken,
  userIsAuthenticated,
} from '../../guards/auth-guard.hook';
import {ReferralService} from './referral.service';
import {
  GetDriverFromReferralCodeParams,
  GetDriverFromReferralCodeParamsType,
  GetUserFromReferralCodeParams,
  GetUserFromReferralCodeParamsType,
} from './schemas/referral-code.params';

@Controller('/v1/referrals')
export class ReferralController {
  @Inject(ReferralService)
  private readonly referralService: ReferralService;

  @GET('/user/:code', {
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
    return this.referralService.getUserFromReferralCode(
      request.user?.id!,
      request.params.code,
    );
  }

  @GET('/user', {
    onRequest: [hasBearerToken, userIsAuthenticated],
  })
  async getUserReferrals(request: Request, reply: Reply) {
    return this.referralService.getUserReferrals(request.user?.id!);
  }

  @GET('/driver/:code', {
    schema: {
      params: GetDriverFromReferralCodeParams,
    },
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async getDriverFromReferralCode(
    request: Request<{
      Params: GetDriverFromReferralCodeParamsType;
    }>,
    reply: Reply,
  ) {
    return this.referralService.getDriverFromReferralCode(
      request.user?.id!,
      request.params.code,
    );
  }

  @GET('/driver', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
  })
  async getDriverReferrals(request: Request, reply: Reply) {
    return this.referralService.getDriverReferrals(request.user?.id!);
  }
}

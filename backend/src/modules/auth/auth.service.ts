import {Inject, Service} from 'fastify-decorators';
import {UserService} from '../user/user.service';
import {
  LogInUserWithFacebookBodyType,
  RefreshUserFacebookTokenBodyType,
} from './schemas/auth-user-facebook.body';
import {LogInDriverWithFacebookBodyType} from './schemas/auth-driver-facebook.body';
import {FacebookService} from '../../shared/facebook/facebook.service';
import {LogInUserWithFacebookResponseType} from './schemas/auth-user-facebook.response';
import {LogInDriverWithFacebookResponseType} from './schemas/auth-driver-facebook.response';
import {trimStrings} from '../../common/utils/string';
import {BadRequest, Unauthorized, InternalServerError} from 'http-errors';
import {AuthTokenPayload} from '../../interfaces/tokens';
import {TokenService} from '../../shared/tokens/token.service';

@Service()
export class AuthService {
  @Inject(TokenService)
  private readonly tokenService: TokenService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(FacebookService)
  private readonly facebookService: FacebookService;

  /** User Auth */

  async logInUserWithFacebook(
    data: LogInUserWithFacebookBodyType,
  ): Promise<LogInUserWithFacebookResponseType> {
    let [facebookId, name] = ['', ''];

    const [facebookAccessToken, facebookUserID] = trimStrings(
      data.accessToken,
      data.userID,
    );

    try {
      const facebookApiResponse = await this.facebookService.verifyUser({
        accessToken: facebookAccessToken,
        userID: facebookUserID,
      });

      [facebookId, name] = [facebookApiResponse.id, facebookApiResponse.name];
    } catch (error) {
      throw new BadRequest(`INVALID_DATA`);
    }

    if (facebookUserID !== facebookId) {
      throw new Unauthorized();
    }

    const user = await this.userService.findByFacebookId(facebookId);
    const userExists = !!user;

    // Create user...
    if (!userExists) {
      const createdUser = await this.userService.createUser({
        facebookAccessToken,
        facebookId,
        name,
      });

      const payload: AuthTokenPayload = {
        id: createdUser.id,
        facebookId: createdUser.facebookId,
        name: createdUser.profile.name,
        dni: createdUser.profile.dni,
        email: createdUser.profile.email,
        phoneNumber: createdUser.profile.phoneNumber,
        avatar: createdUser.profile.avatar,
        isAdmin: createdUser.isAdmin,
      };

      const {accessToken, refreshToken} = this.tokenService.generateTokens(
        'user',
        payload,
      );

      try {
        await this.userService.updateTokens(createdUser.id, {
          accessToken,
          refreshToken,
        });
      } catch (error) {
        throw new InternalServerError();
      }

      const isNew = await this.userService.isNew(createdUser.id);

      return {
        accessToken,
        refreshToken,
        isNew,
      };
    }

    if (user.availability.isBanned) {
      console.log(
        `User with id ${user.id} banned with reason ${user.availability.banReason}`,
      );
      throw new Unauthorized(`USER_BANNED`);
    }

    const payload: AuthTokenPayload = {
      id: user.id,
      facebookId: user.facebookId,
      name: user.profile.name,
      dni: user.profile.dni,
      email: user.profile.email,
      phoneNumber: user.profile.phoneNumber,
      avatar: user.profile.avatar,
      isAdmin: user.isAdmin,
    };

    const {accessToken, refreshToken} = this.tokenService.generateTokens(
      'user',
      payload,
    );

    try {
      await this.userService.updateTokens(user.id, {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      throw new InternalServerError();
    }

    const isNew = await this.userService.isNew(user.id);

    return {
      accessToken,
      refreshToken,
      isNew,
    };
  }

  async refreshUserFacebookToken(data: RefreshUserFacebookTokenBodyType) {
    const decoded = this.tokenService.verifyRefreshToken(
      'user',
      data.refreshToken,
    );
    const user = await this.userService.findByIdOrThrow(decoded.id);

    const payload: AuthTokenPayload = {
      id: user.id,
      facebookId: user.facebookId,
      name: user.profile.name,
      dni: user.profile.dni,
      email: user.profile.email,
      phoneNumber: user.profile.phoneNumber,
      avatar: user.profile.avatar,
      isAdmin: user.isAdmin,
    };

    const accessToken = this.tokenService.generateAccessToken('user', payload);

    return {
      accessToken,
      refreshToken: data.refreshToken,
    };
  }

  async logOutUserFromFacebook(id: string) {
    const user = await this.userService.findByIdOrThrow(id);

    try {
      await this.userService.updateRefreshToken(user.id, null);
    } catch (error) {
      console.log(error);
      throw new InternalServerError();
    }

    return {
      success: true,
    };
  }

  /** Driver Auth */

  async logInDriverWithFacebook(
    data: LogInDriverWithFacebookBodyType,
  ): Promise<LogInDriverWithFacebookResponseType> {
    return {
      accessToken: '',
      refreshToken: '',
      isNew: false,
    };
  }

  async refreshDriverFacebookToken(data: any) {
    return {};
  }

  async logOutDriverFromFacebook(id: string) {
    return {};
  }
}

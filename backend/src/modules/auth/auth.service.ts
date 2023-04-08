import {Inject, Service} from 'fastify-decorators';
import {UserService} from '../user/user.service';
import {DriverService} from '../driver/driver.service';
import {
  LogInUserWithFacebookBodyType,
  RefreshUserFacebookTokenBodyType,
} from './schemas/auth-user-facebook.body';
import {
  LogInDriverWithFacebookBodyType,
  RefreshDriverFacebookTokenBodyType,
} from './schemas/auth-driver-facebook.body';
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

  @Inject(DriverService)
  private readonly driverService: DriverService;

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

    if (
      user.availability.isBanned &&
      user.availability.bannedUntil &&
      new Date(user.availability.bannedUntil) < new Date()
    ) {
      await this.userService.removeBanned(user.id);
      user.availability.isBanned = false;
    }

    if (user.availability.isBanned) {
      console.log(
        `User with id ${user.id} banned with reason ${user.availability.banReason}`,
      );
      throw new Unauthorized('USER_BANNED');
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

    const driver = await this.driverService.findByFacebookId(facebookId);
    const driverExists = !!driver;

    // Create driver...
    if (!driverExists) {
      const createdDriver = await this.driverService.createDriver({
        facebookAccessToken,
        facebookId,
        name,
      });

      const payload: AuthTokenPayload = {
        id: createdDriver.id,
        facebookId: createdDriver.facebookId,
        name: createdDriver.profile.name,
        dni: createdDriver.profile.dni,
        email: createdDriver.profile.email,
        phoneNumber: createdDriver.profile.phoneNumber,
        avatar: createdDriver.profile.avatar,
        isAdmin: createdDriver.isAdmin,
      };

      const {accessToken, refreshToken} = this.tokenService.generateTokens(
        'driver',
        payload,
      );

      try {
        await this.driverService.updateTokens(createdDriver.id, {
          accessToken,
          refreshToken,
        });
      } catch (error) {
        throw new InternalServerError();
      }

      const isNew = await this.driverService.isNew(createdDriver.id);

      return {
        accessToken,
        refreshToken,
        isNew,
      };
    }

    if (
      driver.availability.isBanned &&
      driver.availability.bannedUntil &&
      new Date(driver.availability.bannedUntil) < new Date()
    ) {
      await this.driverService.removeBanned(driver.id);
      driver.availability.isBanned = false;
    }

    if (driver.availability.isBanned) {
      console.log(
        `Driver with id ${driver.id} banned with reason ${driver.availability.banReason}`,
      );
      throw new Unauthorized('DRIVER_BANNED');
    }

    const payload: AuthTokenPayload = {
      id: driver.id,
      facebookId: driver.facebookId,
      name: driver.profile.name,
      dni: driver.profile.dni,
      email: driver.profile.email,
      phoneNumber: driver.profile.phoneNumber,
      avatar: driver.profile.avatar,
      isAdmin: driver.isAdmin,
    };

    const {accessToken, refreshToken} = this.tokenService.generateTokens(
      'driver',
      payload,
    );

    try {
      await this.driverService.updateTokens(driver.id, {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      throw new InternalServerError();
    }

    const isNew = await this.driverService.isNew(driver.id);

    return {
      accessToken,
      refreshToken,
      isNew,
    };
  }

  async refreshDriverFacebookToken(data: RefreshDriverFacebookTokenBodyType) {
    const decoded = this.tokenService.verifyRefreshToken(
      'driver',
      data.refreshToken,
    );
    const driver = await this.driverService.findByIdOrThrow(decoded.id);

    const payload: AuthTokenPayload = {
      id: driver.id,
      facebookId: driver.facebookId,
      name: driver.profile.name,
      dni: driver.profile.dni,
      email: driver.profile.email,
      phoneNumber: driver.profile.phoneNumber,
      avatar: driver.profile.avatar,
      isAdmin: driver.isAdmin,
    };

    const accessToken = this.tokenService.generateAccessToken(
      'driver',
      payload,
    );

    return {
      accessToken,
      refreshToken: data.refreshToken,
    };
  }

  async logOutDriverFromFacebook(id: string) {
    const driver = await this.driverService.findByIdOrThrow(id);

    try {
      await this.driverService.updateRefreshToken(driver.id, null);
    } catch (error) {
      console.log(error);
      throw new InternalServerError();
    }

    return {
      success: true,
    };
  }
}

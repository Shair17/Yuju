import {onRequestHookHandler} from 'fastify';
import {getInstanceByToken} from 'fastify-decorators';
import {Unauthorized} from 'http-errors';
import {UserService} from '../modules/user/user.service';
import {DriverService} from '../modules/driver/driver.service';
import {BEARER_SCHEME_REGEX} from '../common/regex/index';
import {isValidToken} from '../common/helpers/token';
import {isString} from '../common/utils/string';
import {isCuid} from '../common/helpers/cuid';
import jwt from 'jsonwebtoken';
import {AuthTokenPayload} from '../interfaces/tokens';
import {ConfigService} from '../config/config.service';

// Json Web Token Secrets fallbacks
const FALLBACK_JWT_USER_SECRET = process.env.JWT_USER_SECRET!;
const FALLBACK_JWT_DRIVER_SECRET = process.env.JWT_DEALER_SECRET!;

const verifyToken = (token: string) => {
  if (!token) {
    throw new Unauthorized(`INVALID_TOKEN`);
  }

  const tokenIsValid = isValidToken(token);

  if (!tokenIsValid) {
    throw new Unauthorized(`INVALID_TOKEN`);
  }

  const decoded = <jwt.JwtPayload>jwt.decode(token);

  if (!decoded) {
    throw new Unauthorized(`INVALID_TOKEN`);
  }

  if (new Date(decoded.exp! * 1000) < new Date()) {
    throw new Unauthorized(`TOKEN_EXPIRED`);
  }

  return true;
};

const getUserFromToken = (token: string): AuthTokenPayload | null => {
  if (!verifyToken(token)) {
    return null;
  }

  try {
    const configService =
      getInstanceByToken<ConfigService>('ConfigServiceToken');
    const JWT_USER_SECRET =
      configService.get<string>('JWT_USER_SECRET') ?? FALLBACK_JWT_USER_SECRET;

    const userDecoded = <AuthTokenPayload>jwt.verify(token, JWT_USER_SECRET);
    return userDecoded ?? null;
  } catch (error) {
    return null;
  }
};

const getDriverFromToken = (token: string): AuthTokenPayload | null => {
  if (!verifyToken(token)) {
    return null;
  }

  try {
    const configService =
      getInstanceByToken<ConfigService>('ConfigServiceToken');
    const JWT_DRIVER_SECRET =
      configService.get<string>('JWT_DRIVER_SECRET') ??
      FALLBACK_JWT_DRIVER_SECRET;

    const dealerDecoded = <AuthTokenPayload>(
      jwt.verify(token, JWT_DRIVER_SECRET)
    );
    return dealerDecoded ?? null;
  } catch (error) {
    return null;
  }
};

const isValidEntity = (id: string): boolean => isString(id) && isCuid(id);

export const hasBearerToken: onRequestHookHandler = async (request, reply) => {
  const authorization = request.headers.authorization;

  if (!isString(authorization)) {
    throw new Unauthorized('TOKEN_NOT_PROVIDED');
  }

  const parts = <[string, string]>authorization!.split(' ');
  const [scheme, token] = parts;

  if (!(parts.length === 2 && token.split('.').length === 3)) {
    throw new Unauthorized('MALFORMED_TOKEN');
  }

  if (!BEARER_SCHEME_REGEX.test(scheme)) {
    throw new Unauthorized('MALFORMED_TOKEN');
  }

  if (!isValidToken(token)) {
    throw new Unauthorized('MALFORMED_TOKEN');
  }

  const decoded = <jwt.JwtPayload>jwt.decode(token);

  if (!decoded) {
    throw new Unauthorized(`MALFORMED_TOKEN`);
  }

  if (new Date(decoded.exp! * 1000) < new Date()) {
    throw new Unauthorized(`TOKEN_EXPIRED`);
  }
};

// Hook for check if user is authenticated
export const userIsAuthenticated: onRequestHookHandler = async (
  request,
  reply,
) => {
  const [schema, token] = <[string, string]>(
    request.headers.authorization?.split(' ')
  );

  if (!verifyToken(token)) {
    throw new Unauthorized(`INVALID_TOKEN`);
  }

  const userFromToken = getUserFromToken(token);

  if (!userFromToken) {
    throw new Unauthorized(`INVALID_TOKEN`);
  }

  if (!isValidEntity(userFromToken.id)) {
    throw new Unauthorized(`INVALID_TOKEN`);
  }

  const userService = getInstanceByToken<UserService>('UserServiceToken');
  const user = await userService.findByIdOrThrow(userFromToken.id);

  if (
    user.availability.isBanned &&
    user.availability.bannedUntil &&
    new Date(user.availability.bannedUntil) < new Date()
  ) {
    await userService.removeBanned(user.id);
    user.availability.isBanned = false;
  }

  if (user.availability.isBanned) {
    throw new Unauthorized('USER_BANNED');
  }

  request.user = {
    id: user.id,
    facebookId: user.facebookId,
    name: user.profile.name,
    dni: user.profile.dni,
    email: user.profile.email,
    phoneNumber: user.profile.phoneNumber,
    avatar: user.profile.avatar,
    isAdmin: user.isAdmin,
  };
};

// Hook for check if dealer is authenticated
export const driverIsAuthenticated: onRequestHookHandler = async (
  request,
  reply,
) => {
  const parts = <[string, string]>request.headers.authorization?.split(' ');
  const [, token] = parts;

  if (!verifyToken(token)) {
    throw new Unauthorized(`INVALID_TOKEN`);
  }

  const driverFromToken = getDriverFromToken(token);

  if (!driverFromToken) {
    throw new Unauthorized(`INVALID_TOKEN`);
  }

  if (!isValidEntity(driverFromToken.id)) {
    throw new Unauthorized(`INVALID_TOKEN`);
  }

  const driverService = getInstanceByToken<DriverService>('DriverServiceToken');
  const driver = await driverService.findByIdOrThrow(driverFromToken.id);

  if (
    driver.availability.isBanned &&
    driver.availability.bannedUntil &&
    new Date(driver.availability.bannedUntil) < new Date()
  ) {
    await driverService.removeBanned(driver.id);
    driver.availability.isBanned = false;
  }

  if (driver.availability.isBanned) {
    throw new Unauthorized('DRIVER_BANNED');
  }

  request.driver = {
    id: driver.id,
    facebookId: driver.facebookId,
    name: driver.profile.name,
    dni: driver.profile.dni,
    email: driver.profile.email,
    phoneNumber: driver.profile.phoneNumber,
    avatar: driver.profile.avatar,
    isAdmin: driver.isAdmin,
  };
};

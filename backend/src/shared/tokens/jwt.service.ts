import {Service} from 'fastify-decorators';
import jwt, {JwtPayload as IJwtPayload} from 'jsonwebtoken';

export type JwtPayload = IJwtPayload;

export class JsonWebTokenError extends jwt.JsonWebTokenError {}
export class NotBeforeError extends jwt.NotBeforeError {}
export class TokenExpiredError extends jwt.TokenExpiredError {}

@Service('JwtServiceToken')
export class JwtService {
  private readonly jwt = jwt;

  sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: jwt.Secret,
    options?: jwt.SignOptions,
  ) {
    return this.jwt.sign(payload, secretOrPrivateKey, options);
  }

  verify(
    token: string,
    secretOrPublicKey: jwt.Secret,
    options?: jwt.VerifyOptions & {complete: true},
  ) {
    return this.jwt.verify(token, secretOrPublicKey, options);
  }

  decode(token: string, options?: jwt.DecodeOptions & {complete: true}) {
    return this.jwt.decode(token, options);
  }
}

import {Service, Inject} from 'fastify-decorators';
import {Unauthorized, InternalServerError} from 'http-errors';
import {ConfigService} from '../../config/config.service';
import {JwtService, JsonWebTokenError, TokenExpiredError} from './jwt.service';
import {AuthTokenPayload, AuthTokenType, Tokens} from '../../interfaces/tokens';

@Service('TokenServiceToken')
export class TokenService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  verifyRefreshToken(type: AuthTokenType, refreshToken: string) {
    switch (type) {
      case 'user':
        try {
          return <AuthTokenPayload>(
            this.jwtService.verify(
              refreshToken,
              this.configService.getOrThrow<string>('JWT_USER_REFRESH_SECRET'),
            )
          );
        } catch (error) {
          if (error instanceof TokenExpiredError) {
            throw new Unauthorized(`TOKEN_EXPIRED`);
          }

          if (error instanceof JsonWebTokenError) {
            throw new Unauthorized(`INVALID_TOKEN`);
          }

          throw new InternalServerError();
        }

      case 'driver':
        try {
          return <AuthTokenPayload>(
            this.jwtService.verify(
              refreshToken,
              this.configService.getOrThrow<string>(
                'JWT_DRIVER_REFRESH_SECRET',
              ),
            )
          );
        } catch (error) {
          if (error instanceof TokenExpiredError) {
            throw new Unauthorized(`TOKEN_EXPIRED`);
          }

          if (error instanceof JsonWebTokenError) {
            throw new Unauthorized(`INVALID_TOKEN`);
          }

          throw new InternalServerError();
        }

      default:
        throw new Error('Invalid token type');
    }
  }

  generateAccessToken(type: AuthTokenType, payload: AuthTokenPayload): string {
    switch (type) {
      case 'user':
        return this.jwtService.sign(
          payload,
          this.configService.getOrThrow<string>('JWT_USER_SECRET'),
          {
            expiresIn: this.configService.getOrThrow<string>(
              'JWT_USER_SECRET_EXPIRES_IN',
            ),
          },
        );

      case 'driver':
        return this.jwtService.sign(
          payload,
          this.configService.getOrThrow<string>('JWT_DRIVER_SECRET'),
          {
            expiresIn: this.configService.getOrThrow<string>(
              'JWT_DRIVER_SECRET_EXPIRES_IN',
            ),
          },
        );

      default:
        throw new Error('Invalid token type');
    }
  }

  generateRefreshToken(type: AuthTokenType, payload: AuthTokenPayload): string {
    switch (type) {
      case 'user':
        return this.jwtService.sign(
          payload,
          this.configService.getOrThrow<string>('JWT_USER_REFRESH_SECRET'),
          {
            expiresIn: this.configService.getOrThrow<string>(
              'JWT_USER_REFRESH_SECRET_EXPIRES_IN',
            ),
          },
        );

      case 'driver':
        return this.jwtService.sign(
          payload,
          this.configService.getOrThrow<string>('JWT_DRIVER_REFRESH_SECRET'),
          {
            expiresIn: this.configService.getOrThrow<string>(
              'JWT_DRIVER_REFRESH_SECRET_EXPIRES_IN',
            ),
          },
        );

      default:
        throw new Error('Invalid token type');
    }
  }

  generateTokens(type: AuthTokenType, payload: AuthTokenPayload): Tokens {
    return {
      accessToken: this.generateAccessToken(type, payload),
      refreshToken: this.generateRefreshToken(type, payload),
    };
  }
}

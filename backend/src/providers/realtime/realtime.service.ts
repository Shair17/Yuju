import {FastifyInstance} from 'fastify';
import {
  FastifyInstanceToken,
  Initializer,
  Inject,
  Service,
} from 'fastify-decorators';
import {Server as SocketServer} from 'socket.io';
import {OnModuleInit} from '../../interfaces/module';
import {LoggerService} from '../../common/logger/logger.service';
import {DriverService} from '../../modules/driver/driver.service';
import {UserService} from '../../modules/user/user.service';
import {JwtService} from '../../shared/tokens/jwt.service';
import {isValidToken} from '../../common/helpers/token';
import {JwtPayload} from 'jsonwebtoken';
import {isString} from '../../common/utils/string';
import {ConfigService} from '../../config/config.service';

@Service('RealTimeServiceToken')
export class RealTimeService implements OnModuleInit {
  @Inject(FastifyInstanceToken)
  private readonly fastify: FastifyInstance;

  @Inject(LoggerService)
  private readonly loggerService: LoggerService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(DriverService)
  private readonly driverService: DriverService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Initializer()
  async onModuleInit(): Promise<void> {
    this.events();
    this.loggerService.info('Realtime Service is ready for listen events.');
  }

  private events(): void {
    this.client.on('connection', async socket => {
      const token = socket.handshake.auth.token as string;
      const isValidToken = this.isValidToken(token);
      const userId = this.getUserIdFromToken(token);
      const driverId = this.getDriverIdFromToken(token);
      const isUser = isString(userId);
      const isDriver = isString(driverId);

      // Si el token es invalido Ó si no es usuario ni driver entonces desconectar del socket
      if (!isValidToken || (!isUser && !isDriver)) {
        return socket.disconnect();
      }

      // User realtime events...
      if (isUser) {
        console.log('un usuario ha entrado', userId);
      }

      // Driver realtime events...
      if (isDriver) {
        console.log(driverId);
      }

      socket.on('disconnect', async socket => {
        console.log('desconectado');
      });
    });
  }

  getUserIdFromToken(token: string): string | null {
    if (!token) return null;

    try {
      const userDecoded = this.jwtService.verify(
        token,
        this.configService.getOrThrow('JWT_USER_SECRET'),
      ) as {
        id: string;
      };

      return userDecoded.id ?? null;
    } catch (error) {
      return null;
    }
  }

  getDriverIdFromToken(token: string): string | null {
    if (!token) return null;

    try {
      const driverDecoded = this.jwtService.verify(
        token,
        this.configService.getOrThrow('JWT_DRIVER_SECRET'),
      ) as {
        id: string;
      };

      return driverDecoded.id ?? null;
    } catch (error) {
      return null;
    }
  }

  isValidToken(token: string) {
    if (!token) return false;

    if (!isValidToken(token)) return false;

    const decoded = <JwtPayload>this.jwtService.decode(token);

    if (!decoded) return false;

    if (new Date(decoded.exp! * 1000) < new Date()) return false;

    return true;
  }

  public get client(): SocketServer {
    return this.fastify.io;
  }
}

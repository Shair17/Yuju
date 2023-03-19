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
import {QueueService} from './queue.service';
import {JwtService, JwtPayload} from '../../shared/tokens/jwt.service';
import {isValidToken} from '../../common/helpers/token';
import {isString} from '../../common/utils/string';
import {ConfigService} from '../../config/config.service';
import {AuthTokenPayload} from '../../interfaces/tokens';

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IRequestRide {
  passengersId: string;
  from: {
    address?: string;
    location: ILocation;
  };
  to: {
    address?: string;
    location: ILocation;
  };
  passengersQuantity: number;
  price: number;
}

interface UserFromMiddleware extends AuthTokenPayload {
  type: 'user' | 'driver';
}

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

  @Inject(QueueService)
  private readonly queueService: QueueService;

  @Initializer()
  async onModuleInit(): Promise<void> {
    this.registerMiddlewares();
    this.registerEvents();
    this.loggerService.info('Realtime Service is ready for listen events.');
  }

  private registerMiddlewares() {
    this.authMiddleware();
  }

  private authMiddleware() {
    this.client.use((socket, next) => {
      const token = <string>socket.handshake.auth.token;
      const isValidToken = this.isValidToken(token);
      const user = this.getUserFromToken(token);
      const driver = this.getDriverFromToken(token);
      const isUser = !!user && isString(user.id);
      const isDriver = !!driver && isString(driver.id);

      if (!isValidToken || (!isUser && !isDriver)) {
        return next(new Error(`Unauthorized`));
      } else {
        // @ts-ignore
        socket.user = <UserFromMiddleware>{
          type: isUser ? 'user' : 'driver',
          ...(isUser ? user : driver),
        };
        return next();
      }
    });
  }

  private registerEvents(): void {
    this.client.on('connection', async socket => {
      // @ts-ignore
      const user = <UserFromMiddleware>socket.user;
      const isPassenger = user.type === 'user';
      const isDriver = user.type === 'driver';

      if (isPassenger) {
        this.queueService.enqueueToUsers({
          ...user,
          location: {latitude: 0, longitude: 0},
        });

        // Eventos

        // Ubicación del pasajero en tiempo real
        socket.on('PASSENGER_LOCATION', (userLocation: ILocation) => {
          // Actualizamos en la cola de pasajeros (usuarios)
          this.queueService.editUsersQueue({...user, location: userLocation});
        });

        // El pasajero (usuario) solicitó una carrera
        socket.on('REQUEST_RIDE', (data: IRequestRide) => {
          // Aquí establecer un estado de que se está buscando... con socket
          // Buscar los choferes (Mototaxistas), puede ser a los más cercanos o a todos, y solo notificarle a los que no están en una carrera
          // Si se encontró mototaxista y este aceptó,
          // caso contrario, notificarle al usuario que nadie quiso aceptar su carrera y terminar la carga que se inició hace un momento
        });
      }

      if (isDriver) {
        this.queueService.enqueueToDrivers({
          ...user,
          location: {latitude: 0, longitude: 0},
        });
      }

      socket.on('disconnect', async () => {
        if (isPassenger) {
          this.queueService.deleteFromUsersQueue(user.id);
        }

        if (isDriver) {
          this.queueService.deleteFromDriversQueue(user.id);
        }
      });
    });
  }

  getUserFromToken(token: string): AuthTokenPayload | null {
    if (!token) return null;

    try {
      const userDecoded = <AuthTokenPayload>(
        this.jwtService.verify(
          token,
          this.configService.getOrThrow('JWT_USER_SECRET'),
        )
      );

      return userDecoded ?? null;
    } catch (error) {
      return null;
    }
  }

  getDriverFromToken(token: string): AuthTokenPayload | null {
    if (!token) return null;

    try {
      const driverDecoded = <AuthTokenPayload>(
        this.jwtService.verify(
          token,
          this.configService.getOrThrow('JWT_DRIVER_SECRET'),
        )
      );

      return driverDecoded ?? null;
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

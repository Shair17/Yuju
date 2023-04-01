import {FastifyInstance} from 'fastify';
import {
  FastifyInstanceToken,
  Initializer,
  Inject,
  Service,
} from 'fastify-decorators';
import {Server, Socket} from 'socket.io';
import {OnModuleInit} from '../../interfaces/module';
import {LoggerService} from '../../common/logger/logger.service';
// import {DriverService} from '../../modules/driver/driver.service';
// import {UserService} from '../../modules/user/user.service';
import {QueueService} from './queue.service';
import {JwtService, JwtPayload} from '../../shared/tokens/jwt.service';
import {isValidToken} from '../../common/helpers/token';
import {isString} from '../../common/utils/string';
import {ConfigService} from '../../config/config.service';
import {AuthTokenPayload} from '../../interfaces/tokens';
import {DatabaseService} from '../../database/database.service';

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IRequestRide {
  passengerId: string;
  from: {
    address?: string;
    location: ILocation;
  };
  to: {
    address?: string;
    location: ILocation;
  };
  passengersQuantity: number;
  ridePrice: number;
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

  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  // @Inject(UserService)
  // private readonly userService: UserService;

  // @Inject(DriverService)
  // private readonly driverService: DriverService;

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

  private registerEvents(): void {
    this.client
      .of('/users')
      .on('connection', socket => this.usersEvents(socket));
    this.client
      .of('/drivers')
      .on('connection', socket => this.driversEvents(socket));
    this.client
      .of('/admins')
      .on('connection', socket => this.adminsEvents(socket));
  }

  private registerMiddlewares() {
    this.authUsersMiddleware();
    this.authDriversMiddleware();
    this.authAdminsMiddlewares();
  }

  private authUsersMiddleware() {
    this.client.of('/users').use((socket, next) => {
      const token = <string>socket.handshake.auth.token;
      const isValidToken = this.isValidToken(token);
      const user = this.getUserFromToken(token);
      const isUser = !!user && isString(user.id);
      // const profileFields = [user?.dni, user?.email, user?.phoneNumber];
      // const isNew = profileFields.some(field => field == null);

      if (!isValidToken || !isUser) {
        return next(new Error(`Unauthorized User`));
      } else {
        // @ts-ignore
        socket.user = <UserFromMiddleware>{
          type: 'user',
          ...user,
        };

        return next();
      }
    });
  }

  private authDriversMiddleware() {
    this.client.of('/drivers').use((socket, next) => {
      const token = <string>socket.handshake.auth.token;
      const isValidToken = this.isValidToken(token);
      const driver = this.getDriverFromToken(token);
      const isDriver = !!driver && isString(driver.id);

      if (!isValidToken || !isDriver) {
        return next(new Error(`Unauthorized Driver`));
      } else {
        // @ts-ignore
        socket.driver = <UserFromMiddleware>{
          type: 'driver',
          ...driver,
        };

        return next();
      }
    });
  }

  private authAdminsMiddlewares() {
    // For now, only users can be admins
    this.client.of('/admins').use((socket, next) => {
      const token = <string>socket.handshake.auth.token;
      const isValidToken = this.isValidToken(token);
      const user = this.getUserFromToken(token);
      const isUser = !!user && isString(user.id);

      if (!isValidToken || !isUser || !user.isAdmin) {
        return next(new Error(`Unauthorized Admin`));
      } else {
        // @ts-ignore
        socket.user = <UserFromMiddleware>{
          type: 'user',
          ...user,
        };

        return next();
      }
    });
  }

  private usersEvents(socket: Socket) {
    // @ts-ignore
    const user = <UserFromMiddleware>socket.user;

    socket.join(user.id);

    // Encolar a la cola de usuarios
    this.queueService.enqueueToUsers({
      ...user,
      location: {latitude: 0, longitude: 0},
    });

    // Emitir al usuario si está en un viaje o no
    socket.emit(
      'PASSENGER_IS_IN_RIDE',
      this.queueService.userExistsInRide(user.id),
    );

    // Emitir al usuario si está en un viaje pendiente o no
    socket.emit(
      'PASSENGER_IS_IN_RIDE_PENDING',
      this.queueService.userExistsInRidePending(user.id),
    );

    socket.emit('AVAILABLE_DRIVERS', this.queueService.driversToArray());

    // El usuario pregunta si un driver está conectado
    socket.on(
      'IS_DRIVER_ONLINE',
      (driverId: string, cb: (isOnline: boolean) => void) => {
        // Is Online
        const isConnected = this.queueService.existsInDriversQueue(driverId);
        const isInRide = this.queueService.driverExistsInRide(driverId);
        const isOnline = isConnected || isInRide;

        cb(isOnline);
      },
    );

    // Ubicación del pasajero en tiempo real
    socket.on('PASSENGER_LOCATION', (userLocation: ILocation) => {
      // Actualizamos en la cola de pasajeros (usuarios)
      this.queueService.editUsersQueue({
        ...user,
        location: userLocation,
      });
    });

    // El pasajero (usuario) solicitó una carrera
    socket.on('REQUEST_RIDE', async (data: IRequestRide) => {
      // console.log(data);

      if (
        this.queueService.userExistsInRide(data.passengerId) ||
        this.queueService.userExistsInRidePending(data.passengerId)
      ) {
        console.log('nel');
        return;
      } else {
        console.log('si');
        const {passengerId, from, to, passengersQuantity, ridePrice} = data;

        const createdTrip = await this.databaseService.trip.create({
          data: {
            price: ridePrice,
            from: {
              create: {
                address: from.address,
                latitude: from.location.latitude,
                longitude: from.location.longitude,
              },
            },
            to: {
              create: {
                address: to.address,
                latitude: to.location.latitude,
                longitude: from.location.longitude,
              },
            },
            passengersQuantity,
            user: {
              connect: {
                id: passengerId,
              },
            },
          },
        });

        this.queueService.enqueueToInRidePending({
          id: createdTrip.id,
          passengersQuantity,
          to,
          from,
          ridePrice,
          user: {
            ...user,
            location: {...from.location},
          },
        });

        this.client
          .of('/users')
          .to(data.passengerId)
          .emit(
            'PASSENGER_IS_IN_RIDE_PENDING',
            this.queueService.userExistsInRidePending(user.id),
          );
        // Aquí establecer un estado de que se está buscando... con socket
        // socket
        // .to(data.passengerId)
        // .emit('LOOKING_FOR_DRIVER', 'está buscando...');
        // Buscar los choferes (Mototaxistas), puede ser a los más cercanos o a todos, y solo notificarle a los que no están en una carrera
        // Si se encontró mototaxista y este aceptó,
        // caso contrario, notificarle al usuario que nadie quiso aceptar su carrera y terminar la carga que se inició hace un momento
      }
    });

    socket.on('disconnect', async reason => {
      this.queueService.deleteFromUsersQueue(user.id);
    });
  }

  private async driversEvents(socket: Socket) {
    // @ts-ignore
    const driver = <UserFromMiddleware>socket.driver;

    socket.join(driver.id);

    this.queueService.enqueueToDrivers({
      ...driver,
      location: {latitude: 0, longitude: 0},
    });

    // Eventos

    // Emitir globalmente todos los choferes disponibles
    // this.client.emit(
    //   'AVAILABLE_DRIVERS',
    //   this.queueService._driversToArray(),
    // );
    this.queueService.usersToArray().forEach(user => {
      socket
        .to(user.id)
        .emit('AVAILABLE_DRIVERS', this.queueService.driversToArray());
    });

    // Emitir al chofer si está en un viaje o no
    socket.emit('DRIVER_IS_IN_RIDE', () =>
      this.queueService.driverExistsInRide(driver.id),
    );

    socket.on('disconnect', async reason => {
      this.queueService.deleteFromDriversQueue(driver.id);

      this.queueService.usersToArray().forEach(user => {
        this.client
          .of('/users')
          .to(user.id)
          .emit('AVAILABLE_DRIVERS', this.queueService.driversToArray());
      });
    });
  }

  private async adminsEvents(socket: Socket) {
    // @ts-ignore
    const admin = <UserFromMiddleware>socket.admin;

    socket.on('disconnect', async reason => {});
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

  public get client(): Server {
    return this.fastify.io;
  }
}

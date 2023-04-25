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
import {QueueService, InRide, InRidePending} from './queue.service';
import {JwtService, JwtPayload} from '../../shared/tokens/jwt.service';
import {isValidToken} from '../../common/helpers/token';
import {isString} from '../../common/utils/string';
import {ConfigService} from '../../config/config.service';
import {AuthTokenPayload} from '../../interfaces/tokens';
import {DatabaseService} from '../../database/database.service';
import {TripStatus} from '@prisma/client';
import {CitieService} from '../cities/citie.service';

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

  @Inject(CitieService)
  private readonly citieService: CitieService;

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

    if (this.queueService.userExistsInRidePending(user.id)) {
      socket.emit(
        'PASSENGER_IN_RIDE_PENDING',
        this.queueService.userIsInRidePending(user.id),
      );
    }

    if (this.queueService.userExistsInRide(user.id)) {
      socket.emit('PASSENGER_IN_RIDE', this.queueService.userIsInRide(user.id));
    }

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
      if (userLocation.latitude === 0 && userLocation.longitude === 0) {
        return;
      }

      // Actualizamos en la cola de pasajeros (usuarios)
      this.queueService.editUsersQueue({
        ...user,
        location: userLocation,
      });

      socket.emit(
        'ALLOWED_TO_USE_APP',
        this.citieService.isInAllowedCities(userLocation),
      );
    });

    // El pasajero (usuario) solicitó una carrera
    socket.on('REQUEST_RIDE', async (data: IRequestRide) => {
      if (this.queueService.userExistsInRidePending(data.passengerId)) {
        this.client
          .of('/users')
          .to(data.passengerId)
          .emit(
            'PASSENGER_IN_RIDE_PENDING',
            this.queueService.userIsInRidePending(user.id),
          );

        return;
      } else if (this.queueService.userExistsInRide(data.passengerId)) {
        this.client
          .of('/users')
          .to(data.passengerId)
          .emit('PASSENGER_IN_RIDE', this.queueService.userIsInRide(user.id));

        return;
      } else {
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
            status: TripStatus.Pending,
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
            'PASSENGER_IN_RIDE_PENDING',
            this.queueService.userIsInRidePending(user.id),
          );

        // Obtener el chofer más cercano
        const closestDriver = this.queueService.getClosestDriver(from.location);

        console.log({closestDriver});

        if (!closestDriver) {
          // No se encontró chofer cercano entonces emitir a todos los choferes de las carreras pendientes
          this.client
            .of('/drivers')
            .emit('PENDING_RIDES', this.queueService.inRidePendingToArray());
          return;
        }

        const rideRequest = data;

        // Emitir al driver más cercano la solicitud de carrera
        this.client
          .of('/drivers')
          .to(closestDriver.id)
          .emit('RIDE_REQUEST', rideRequest);
      }
    });

    socket.on(
      'RIDE_LOCATION_UPDATE',
      (data: {
        id: InRide['id'];
        passenger: {id: InRide['user']['id']};
        driver: {id: InRide['driver']['id']};
        location: ILocation;
      }) => {
        if (
          !this.queueService.userExistsInRide(data.passenger.id) ||
          !this.queueService.driverExistsInRide(data.driver.id)
        )
          return;

        this.queueService.updateInRideLocation(data.id, data.location);
      },
    );

    // El pasajero (usuario) cancela una carrera
    socket.on(
      'CANCEL_RIDE',
      async (data: {
        id: InRide['id'];
        passenger: {id: InRide['user']['id']};
        driver: {id: InRide['driver']['id']};
      }) => {
        if (!this.queueService.userExistsInRide(data.passenger.id)) return;

        this.queueService.deleteFromInRideQueue(data.id);

        await this.databaseService.trip.update({
          where: {
            id: data.id,
          },
          data: {
            status: TripStatus.Cancelled,
          },
        });

        socket.emit(
          'PASSENGER_IN_RIDE_PENDING',
          this.queueService.userIsInRidePending(user.id),
        );

        socket.emit(
          'PASSENGER_IN_RIDE',
          this.queueService.userIsInRide(user.id),
        );

        this.client.of('/drivers').to(data.driver.id).emit('CANCEL_RIDE', data);
      },
    );

    socket.on(
      'CANCEL_RIDE_PENDING',
      async (data: {
        id: InRidePending['id'];
        passenger: {id: InRidePending['user']['id']};
      }) => {
        if (!this.queueService.userExistsInRidePending(data.passenger.id))
          return;

        this.queueService.deleteFromInRidePendingQueue(data.id);

        await this.databaseService.trip.update({
          where: {
            id: data.id,
          },
          data: {
            status: TripStatus.Cancelled,
          },
        });

        this.client
          .of('/users')
          .to(data.passenger.id)
          .emit('PASSENGER_IN_RIDE', this.queueService.userIsInRide(user.id));
        this.client
          .of('/users')
          .to(data.passenger.id)
          .emit(
            'PASSENGER_IN_RIDE_PENDING',
            this.queueService.userIsInRidePending(user.id),
          );
      },
    );

    socket.on(
      'TRACK_TRIP',
      (trackingCode: string, cb: (isOnline: InRide | null) => void) => {
        if (
          this.queueService.userExistsInRidePending(user.id) ||
          this.queueService.userExistsInRide(user.id)
        ) {
          cb(null);
          return;
        }

        cb(this.queueService.getFromInRideQueueByTrackingCode(trackingCode));
      },
    );

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

    this.client
      .of('/users')
      .emit('AVAILABLE_DRIVERS', this.queueService.driversToArray());

    // Pending Rides
    // socket.emit('PENDING_RIDES', this.queueService.inRidePendingToArray());
    socket.emit('PENDING_RIDES', [
      {
        id: '123',
        user: {
          id: '1234509876543',
          facebookId: '1234567890',
          name: 'Jimmy Morales',
          email: 'hello@shair.dev',
          phoneNumber: '966107266',
          dni: '74408267',
          avatar: 'https://avatars.githubusercontent.com/u/18153674?v=4',
          isAdmin: false,
          location: {
            latitude: 0,
            longitude: 0,
          },
        },
        from: {
          address: 'Ricardo Palma 200 Chequen',
          location: {
            latitude: -7.2312306766348655,
            longitude: -79.41698569669288,
          },
        },
        to: {
          address: 'Talambo',
          location: {
            latitude: -7.241504526019357,
            longitude: -79.40049305319835,
          },
        },
        passengersQuantity: 1,
        ridePrice: 3,
      },
    ]);

    if (this.queueService.driverExistsInRide(driver.id)) {
      socket.emit(
        'DRIVER_IN_RIDE',
        this.queueService.driverIsInRide(driver.id),
      );
    }

    // Ubicación del chofer en tiempo real
    socket.on('DRIVER_LOCATION', (driverLocation: ILocation) => {
      if (driverLocation.latitude === 0 && driverLocation.longitude === 0) {
        return;
      }

      // Actualizamos en la cola de pasajeros (usuarios)
      this.queueService.editDriversQueue({
        ...driver,
        location: driverLocation,
      });

      socket.emit(
        'ALLOWED_TO_USE_APP',
        this.citieService.isInAllowedCities(driverLocation),
      );
    });

    socket.on('RIDE_REQUEST', async (data: IRequestRide) => {
      if (this.queueService.driverExistsInRide(driver.id)) {
        socket.emit(
          'DRIVER_IN_RIDE',
          this.queueService.driverIsInRide(driver.id),
        );
        return;
      }
    });

    socket.on(
      'RIDE_LOCATION_UPDATE',
      (data: {
        id: InRide['id'];
        passenger: {id: InRide['user']['id']};
        driver: {id: InRide['driver']['id']};
        location: ILocation;
      }) => {
        if (
          !this.queueService.userExistsInRide(data.passenger.id) ||
          !this.queueService.driverExistsInRide(data.driver.id)
        )
          return;

        this.queueService.updateInRideLocation(data.id, data.location);
      },
    );

    socket.on(
      'CANCEL_RIDE',
      async (data: {
        id: InRide['id'];
        passenger: {id: InRide['user']['id']};
        driver: {id: InRide['driver']['id']};
      }) => {
        if (!this.queueService.driverExistsInRide(data.driver.id)) return;

        this.queueService.deleteFromInRideQueue(data.id);

        await this.databaseService.trip.update({
          where: {
            id: data.id,
          },
          data: {
            status: TripStatus.Cancelled,
          },
        });

        socket.emit(
          'DRIVER_IN_RIDE',
          this.queueService.driverIsInRide(driver.id),
        );

        this.client
          .of('/users')
          .to(data.passenger.id)
          .emit('CANCEL_RIDE', data);
      },
    );

    socket.on('disconnect', async reason => {
      this.queueService.deleteFromDriversQueue(driver.id);

      this.client
        .of('/users')
        .emit('AVAILABLE_DRIVERS', this.queueService.driversToArray());
    });
  }

  private async adminsEvents(socket: Socket) {
    // @ts-ignore
    const admin = <UserFromMiddleware>socket.admin;

    socket.join(admin.id);

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

import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {DriverService} from '../driver/driver.service';
import {UserService} from '../user/user.service';
import {GetMeetYourDriverParamsType} from './schemas/meet-your-driver.params.schema';
import {RatingService} from '../rating/rating.service';
import {NotFound} from 'http-errors';
import {GetUserTripsQueryType} from './schemas/get-user-trips.query';
import {TripStatus} from '@prisma/client';
import {InRidePending} from '../../providers/realtime/queue.service';
import {GetDriverTripsQueryType} from './schemas/get-driver-trips.query';

@Service('TripServiceToken')
export class TripService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(DriverService)
  private readonly driverService: DriverService;

  @Inject(RatingService)
  private readonly ratingService: RatingService;

  async getMeeetYourDriver(userId: string, data: GetMeetYourDriverParamsType) {
    const [user, driver] = await Promise.all([
      this.userService.findByIdOrThrow(userId),
      this.driverService.findByIdOrThrow(data.driverId),
    ]);

    const rankings = await this.driverService.getFirstsRatings(driver.id);
    const rankingsTotal = await this.ratingService.getMyDriversCount(driver.id);
    const rankingsAverage = await this.ratingService.getDriverRatingAverage(
      driver.id,
    );
    const completedTrips = await this.getMyDriversCompletedCount(driver.id);

    return {
      driver: {
        id: driver.id,
        name: driver.profile.name,
        avatar: driver.profile.avatar,
        createdAt: driver.createdAt,
        // resumen del mototaxista
        summary: driver.summary,
        completedTrips,
        // cantidad de calificaciones
        rankingsTotal,
        // fotos de la mototaxi (máximo 5) {String}
        vehiclesPhotos: driver.vehicle.photos,
        // 5 últimas calificaciones del mototaxista (avatar del usuario que hizo la calificacion, nombre del usuario, la calificación que estableció 1-5, hace cuanto tiempo se creó esa calificación, y la descripción que haya creado el usuario en el caso que haya una)
        rankings,
        // promedio de estrella (en base a las calificaciones)
        rankingsAverage,
      },
      user: {
        id: user.id,
        name: user.profile.name,
      },
    };
  }

  async getDriverTrips(id: string, data: GetDriverTripsQueryType) {
    const driver = await this.driverService.findByIdOrThrow(id);

    const {limit, page} = data;

    const tripsFromDB = await this.databaseService.trip.findMany({
      where: {
        driver: {
          id: driver.id,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        driver: {
          select: {
            id: true,
            profile: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            profile: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        from: {
          select: {
            id: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        to: {
          select: {
            id: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        passengersQuantity: true,
        price: true,
        status: true,
        ratings: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const trips = tripsFromDB.map(
      ({
        id,
        price,
        passengersQuantity,
        user,
        driver,
        status,
        from,
        to,
        ratings,
        startTime,
        endTime,
        createdAt,
        updatedAt,
      }) => {
        return {
          id,
          price,
          passengersQuantity,
          user,
          driver,
          rating: Math.round(
            ratings.reduce((suma, rating) => suma + rating.value, 0) /
              ratings.length,
          ),
          from,
          to,
          status,
          startTime,
          endTime,
          createdAt,
          updatedAt,
        };
      },
    );

    const totalTrips = await this.getMyDriversCount(id);

    const totalPages = Math.ceil(totalTrips / limit);

    return {
      data: trips,
      page,
      limit,
      totalPages,
      total: totalTrips,
    };
  }

  async getUserTrips(id: string, data: GetUserTripsQueryType) {
    const user = await this.userService.findByIdOrThrow(id);

    const {limit, page} = data;

    const tripsFromDB = await this.databaseService.trip.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        driver: {
          select: {
            id: true,
            profile: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            profile: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        from: {
          select: {
            id: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        to: {
          select: {
            id: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        passengersQuantity: true,
        price: true,
        status: true,
        ratings: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const trips = tripsFromDB.map(
      ({
        id,
        price,
        passengersQuantity,
        user,
        driver,
        status,
        from,
        to,
        ratings,
        startTime,
        endTime,
        createdAt,
        updatedAt,
      }) => {
        return {
          id,
          price,
          passengersQuantity,
          user,
          driver,
          rating: Math.round(
            ratings.reduce((suma, rating) => suma + rating.value, 0) /
              ratings.length,
          ),
          from,
          to,
          status,
          startTime,
          endTime,
          createdAt,
          updatedAt,
        };
      },
    );

    const totalTrips = await this.getMyUsersCount(id);

    const totalPages = Math.ceil(totalTrips / limit);

    return {
      data: trips,
      page,
      limit,
      totalPages,
      total: totalTrips,
    };
  }

  async getMyDriversCompletedCount(id: string) {
    return this.databaseService.trip.count({
      where: {
        driver: {
          id,
        },
        status: 'Completed',
      },
    });
  }

  async getMyUsersCompletedCount(id: string) {
    return this.databaseService.trip.count({
      where: {
        user: {
          id,
        },
        status: 'Completed',
      },
    });
  }

  async getMyDriversCount(id: string) {
    return this.databaseService.trip.count({
      where: {
        driver: {
          id,
        },
      },
    });
  }

  async getMyUsersCount(id: string) {
    return this.databaseService.trip.count({
      where: {
        user: {
          id,
        },
      },
    });
  }

  async findById(id: string) {
    return this.databaseService.trip.findUnique({where: {id}});
  }

  async findByIdOrThrow(id: string) {
    const trip = await this.findById(id);

    if (!trip) {
      throw new NotFound();
    }

    return trip;
  }

  async getTripsForQueue(): Promise<InRidePending[]> {
    const tripsFromDB = await this.databaseService.trip.findMany({
      where: {
        status: TripStatus.Pending,
      },
      select: {
        id: true,
        price: true,
        passengersQuantity: true,
        from: {
          select: {
            latitude: true,
            longitude: true,
            address: true,
          },
        },
        to: {
          select: {
            latitude: true,
            longitude: true,
            address: true,
          },
        },
        user: {
          select: {
            id: true,
            facebookId: true,
            isAdmin: true,
            profile: {
              select: {
                phoneNumber: true,
                name: true,
                avatar: true,
                dni: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const trips: InRidePending[] = tripsFromDB.map(
      ({id, price, passengersQuantity, user, from, to}) => {
        return {
          id,
          ridePrice: price,
          passengersQuantity,
          user: {
            id: user.id,
            phoneNumber: user.profile.phoneNumber!,
            name: user.profile.name,
            avatar: user.profile.avatar,
            dni: user.profile.dni!,
            email: user.profile.email!,
            facebookId: user.facebookId,
            isAdmin: user.isAdmin,
            location: {
              latitude: from.latitude,
              longitude: from.longitude,
            },
          },
          from: {
            address: from.address ?? undefined,
            location: {
              latitude: from.latitude,
              longitude: from.longitude,
            },
          },
          to: {
            address: to.address ?? undefined,
            location: {
              latitude: to.latitude,
              longitude: to.longitude,
            },
          },
        };
      },
    );

    return trips;
  }
}

import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {DriverService} from '../driver/driver.service';
import {UserService} from '../user/user.service';
import {GetMeetYourDriverParamsType} from './schemas/meet-your-driver.params.schema';
import {RatingService} from '../rating/rating.service';
import {NotFound} from 'http-errors';
import {GetUserTripsQueryType} from './schemas/get-user-trips.query';

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

    return {
      driver: {
        id: driver.id,
        name: driver.profile.name,
        avatar: driver.profile.avatar,
        createdAt: driver.createdAt,
        // resumen del mototaxista
        summary: 'resumen del mototaxista',
        completedTrips: 0,
        // cantidad de calificaciones
        rankingsTotal,
        // fotos de la mototaxi (máximo 5) {String}
        vehiclesPhotos: [],
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
          rating: ratings.reduce((suma, rating) => suma + rating.value, 0),
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
}

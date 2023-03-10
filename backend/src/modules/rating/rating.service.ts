import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {GetUserRatingsQueryType} from './schemas/get-user-rating.query';
import {UserService} from '../user/user.service';
import {GetDriverRatingsQueryType} from './schemas/get-driver-rating.query';
import {DriverService} from '../driver/driver.service';
import {CreateUserRatingsBodyType} from './schemas/create-user-rating.body';
import {CreateDriverRatingsBodyType} from './schemas/create-driver-rating.body';
import {TripService} from '../trip/trip.service';

@Service('RatingServiceToken')
export class RatingService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(DriverService)
  private readonly driverService: DriverService;

  @Inject(TripService)
  private readonly tripService: TripService;

  // Get all rankings for users
  async getUsersCount(): Promise<number> {
    return this.databaseService.rating.count({
      where: {
        userId: {
          not: undefined,
        },
      },
    });
  }

  // Get all rankings for drivers
  async getDriversCount(): Promise<number> {
    return this.databaseService.rating.count({
      where: {
        driverId: {
          not: undefined,
        },
      },
    });
  }

  async getMyUsersCount(id: string) {
    return this.databaseService.rating.count({
      where: {
        user: {
          id,
        },
      },
    });
  }

  async getMyDriversCount(id: string) {
    return this.databaseService.rating.count({
      where: {
        driver: {
          id,
        },
      },
    });
  }

  async getUserRatings(id: string, data: GetUserRatingsQueryType) {
    const user = await this.userService.findByIdOrThrow(id);

    const {limit, page} = data;

    const ratings = await this.databaseService.rating.findMany({
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
                phoneNumber: true,
                email: true,
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
                phoneNumber: true,
                email: true,
              },
            },
          },
        },
        value: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalRatings = await this.getMyUsersCount(id);

    const totalPages = Math.ceil(totalRatings / limit);

    return {
      ratings,
      page,
      limit,
      totalPages,
      totalRatings,
    };
  }

  async getDriverRatings(id: string, data: GetDriverRatingsQueryType) {
    const driver = await this.driverService.findByIdOrThrow(id);

    const {limit, page} = data;

    const ratings = await this.databaseService.rating.findMany({
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
                phoneNumber: true,
                email: true,
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
                phoneNumber: true,
                email: true,
              },
            },
          },
        },
        value: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalRatings = await this.getMyDriversCount(driver.id);

    const totalPages = Math.ceil(totalRatings / limit);

    return {
      ratings,
      page,
      limit,
      totalPages,
      totalRatings,
    };
  }

  async getDriverRatingAverage(id: string) {
    // const resultado = await this.databaseService.rating.groupBy({
    //   where: {
    //     id,
    //   },
    //   by: ['driverId'],
    //   _sum: {
    //     value: true,
    //   },
    //   _count: {
    //     value: true,
    //   },
    // });
    // const promedio = resultado[0]._sum.value! / resultado[0]._count.value;
    // return promedio;

    const ratings = await this.databaseService.rating.findMany({
      where: {
        id,
      },
    });

    const sumaDeEstrellitas = ratings.reduce((suma, rating) => {
      return suma + rating.value;
    }, 0);

    const avarage = sumaDeEstrellitas / ratings.length;

    return avarage;
  }

  async createUserRating(id: string, data: CreateUserRatingsBodyType) {
    const [user, driver] = await Promise.all([
      this.userService.findByIdOrThrow(id),
      this.driverService.findByIdOrThrow(data.driverId),
      this.tripService.findByIdOrThrow(data.tripId),
    ]);

    const createdRating = await this.databaseService.rating.create({
      data: {
        comment: data.comment,
        driver: {
          connect: {
            id: driver.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        value: data.value,
      },
    });

    return createdRating;
  }

  async createDriverRating(id: string, data: CreateDriverRatingsBodyType) {
    const [driver, user, trip] = await Promise.all([
      this.driverService.findByIdOrThrow(id),
      this.userService.findByIdOrThrow(data.userId),
      this.tripService.findByIdOrThrow(data.tripId),
    ]);

    const createdRating = await this.databaseService.rating.create({
      data: {
        comment: data.comment,
        driver: {
          connect: {
            id: driver.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        value: data.value,
      },
    });

    return createdRating;
  }
}

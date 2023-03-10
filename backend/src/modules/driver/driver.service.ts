import {Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {
  getCurrentMonthStart,
  getCurrentMonthEnd,
} from '../../common/utils/date';
import {NotFound, BadRequest, Unauthorized} from 'http-errors';
import {MAX_RATINGS_COUNT_FOR_MEET_YOUR_DRIVER} from '../../common/constants/app';

@Service('DriverServiceToken')
export class DriverService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: string) {
    return this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        profile: true,
        facebookId: true,
        facebookAccessToken: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByIdOrThrow(id: string) {
    const driver = await this.findById(id);

    if (!driver) {
      throw new NotFound(`DRIVER_NOT_FOUND`);
    }

    return driver;
  }

  async isPremium(id: string) {
    const currentMonthStart = getCurrentMonthStart();
    const currentMonthEnd = getCurrentMonthEnd();

    const driver = await this.databaseService.driver.findUnique({
      where: {
        id: id,
      },
      select: {
        membership: {
          where: {
            start: {
              lte: currentMonthEnd,
            },
            end: {
              gte: currentMonthStart,
            },
          },
        },
      },
    });

    if (!driver) return false;

    return driver.membership.length > 0 ?? false;
  }

  async isNew(id: string): Promise<boolean> {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        profile: true,
      },
    });

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
    }

    // Here adds more fields, like `licencia de conducir (brevete)` + `Tarjeta de Propiedad` + `Permiso de la Municipalidad` + `Revisión Técnica` + `SOAT`
    const profileFields = [
      driver.profile.birthDate,
      driver.profile.dni,
      driver.profile.email,
      driver.profile.phoneNumber,
    ];

    const isNew = profileFields.some(element => element == null);

    return isNew;
  }

  async getFirstsRatings(
    id: string,
    take: number = MAX_RATINGS_COUNT_FOR_MEET_YOUR_DRIVER,
  ) {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        ratings: {
          select: {
            id: true,
            value: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                profile: {
                  select: {
                    avatar: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take,
        },
      },
    });

    const ratings = driver?.ratings.map(
      ({id, comment, value, createdAt, user}) => ({
        id,
        comment,
        value,
        createdAt,
        user: {
          id: user.id,
          avatar: user.profile.avatar,
          name: user.profile.name,
        },
      }),
    );

    return ratings ?? [];
  }
}

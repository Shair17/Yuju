import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {NotFound, BadRequest, Unauthorized} from 'http-errors';
import {
  MAX_RATINGS_COUNT_FOR_MEET_YOUR_DRIVER,
  defaultAvatarUri,
} from '../../common/constants/app';
import {trimStrings} from '../../common/utils/string';
import {CreateDriverBodyType} from './schemas/create-driver.body';
import {generateRandomReferralCode} from '../../common/utils/random';
import {GetDriverIsBannedResponseType} from './schemas/is-banned.response';
import {UpdateMeBodyType} from './schemas/update-me.body';
import {CreateMeBodyType} from './schemas/create-me.body';

type TUpdateTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

@Service('DriverServiceToken')
export class DriverService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  async getMe(id: string) {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        profile: true,
        facebookId: true,
        facebookAccessToken: true,
        availability: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
    }

    return {
      driver,
    };
  }

  async isBanned(id: string): Promise<GetDriverIsBannedResponseType> {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        availability: true,
      },
    });

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
    }

    return {
      isBanned: driver.availability.isBanned,
      banReason: driver.availability.banReason,
    };
  }

  async getDrivers() {
    return this.databaseService.driver.findMany();
  }

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
        isAdmin: true,
        summary: true,
        vehicle: true,
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

  async count() {
    return this.databaseService.driver.count();
  }

  async isNew(id: string): Promise<boolean> {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        profile: true,
        summary: true,
        vehicle: true,
      },
    });

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
    }

    // Here adds more fields, like `licencia de conducir (brevete)` + `Tarjeta de Propiedad` + `Permiso de la Municipalidad` (Tarjeta de circulación) + `Revisión Técnica` + `SOAT`
    const profileFields = [
      //# profile
      driver.profile.birthDate,
      driver.profile.dni,
      driver.profile.email,
      driver.profile.phoneNumber,

      //# summary
      driver.summary,

      //# vehicle
      driver.vehicle.license,
      driver.vehicle.propertyCard,
      driver.vehicle.circulationCard,
      driver.vehicle.technicalReview,
      driver.vehicle.soat,

      driver.vehicle.photos,
    ];

    const isNew = profileFields.some(
      element =>
        element == null ||
        element == undefined ||
        (Array.isArray(element) && element.length == 0),
    );

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

  async updateTokens(id: string, tokens: TUpdateTokens) {
    return this.databaseService.driver.update({
      where: {
        id,
      },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  }

  async generateReferralCode(): Promise<string> {
    const referralCode = generateRandomReferralCode();

    const foundDriver = await this.databaseService.driver.findFirst({
      where: {
        referralCode,
      },
      select: {
        id: true,
        referralCode: true,
      },
    });

    return foundDriver?.referralCode ?? generateRandomReferralCode();
  }

  async removeBanned(id: string): Promise<void> {
    await this.databaseService.driver.update({
      where: {id},
      data: {
        availability: {
          update: {
            isBanned: false,
            bannedUntil: null,
            banReason: null,
          },
        },
      },
    });
  }

  async createMe(id: string, data: CreateMeBodyType) {}

  async updateMe(id: string, data: UpdateMeBodyType) {}

  async createDriver(data: CreateDriverBodyType) {
    const [facebookAccessToken, facebookId, name] = trimStrings(
      data.facebookAccessToken,
      data.facebookId,
      data.name,
    );

    const referralCode = await this.generateReferralCode();

    const createdDriver = await this.databaseService.driver.create({
      data: {
        facebookId,
        facebookAccessToken,
        referralCode,
        profile: {
          create: {
            avatar: defaultAvatarUri,
            name,
          },
        },
        availability: {
          create: {
            isBanned: false,
          },
        },
        vehicle: {},
      },
      select: {
        id: true,
        profile: true,
        facebookId: true,
        facebookAccessToken: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
        isAdmin: true,
      },
    });

    return createdDriver;
  }

  async findByFacebookId(facebookId: string) {
    return this.databaseService.driver.findUnique({
      where: {
        facebookId,
      },
      select: {
        id: true,
        profile: true,
        facebookId: true,
        facebookAccessToken: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
        isAdmin: true,
      },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.databaseService.driver.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    });
  }
}

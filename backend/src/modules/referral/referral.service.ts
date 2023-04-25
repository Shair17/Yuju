import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {NotFound, BadRequest, Unauthorized} from 'http-errors';
import {generateRandomReferralCode} from '../../common/utils/random';
import {DriverService} from '../driver/driver.service';
import {
  MAXIMUM_EARNINGS_FOR_REFERRALS,
  MAXIMUM_REFERRALS,
} from '../../common/constants/app';

@Service('ReferralServiceToken')
export class ReferralService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(DriverService)
  private readonly driverService: DriverService;

  async getUserReferrals(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
      select: {
        referralCode: true,
        referredBy: {
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
        referredUsers: {
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
      },
    });

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    const myReferrals = user.referredUsers.map(
      ({id, profile: {avatar, name}}) => ({
        id,
        name,
        avatar,
      }),
    );

    const referrals = myReferrals.slice(0, MAXIMUM_REFERRALS);

    return {
      earn: MAXIMUM_EARNINGS_FOR_REFERRALS,
      myEarnings:
        referrals.length * (MAXIMUM_EARNINGS_FOR_REFERRALS / MAXIMUM_REFERRALS),
      maxReferrals: MAXIMUM_REFERRALS,
      code: user.referralCode,
      referrals,
      referredBy: user.referredBy,
    };
  }

  async getUserFromReferralCode(id: string, code: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        referralCode: code,
      },
      select: {
        id: true,
        referralCode: true,
        profile: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFound(`USER_FROM_REFERRAL_CODE_NOT_FOUND`);
    }

    if (user.id === id) {
      throw new BadRequest(`CANT_USE_OWN_CODE`);
    }

    return {
      referralCode: user.referralCode,
      user: {
        id: user.id,
        name: user.profile.name,
        avatar: user.profile.avatar,
      },
    };
  }

  async getDriverReferrals(id: string) {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        referralCode: true,
        referredBy: {
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
        referredDrivers: {
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
      },
    });

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
    }

    const myReferrals = driver.referredDrivers.map(
      ({id, profile: {avatar, name}}) => ({
        id,
        name,
        avatar,
      }),
    );

    const referrals = myReferrals.slice(0, MAXIMUM_REFERRALS);

    return {
      earn: MAXIMUM_EARNINGS_FOR_REFERRALS,
      myEarnings:
        referrals.length * (MAXIMUM_EARNINGS_FOR_REFERRALS / MAXIMUM_REFERRALS),
      maxReferrals: MAXIMUM_REFERRALS,
      code: driver.referralCode,
      referrals,
      referredBy: driver.referredBy,
    };
  }

  async getDriverFromReferralCode(id: string, code: string) {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        referralCode: code,
      },
      select: {
        id: true,
        referralCode: true,
        profile: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFound(`DRIVER_FROM_REFERRAL_CODE_NOT_FOUND`);
    }

    if (driver.id === id) {
      throw new BadRequest(`CANT_USE_OWN_CODE`);
    }

    const isNew = await this.driverService.isNew(driver.id);
    const {isActive} = await this.driverService.getImActive(driver.id);

    if (isNew || !isActive) {
      throw new NotFound(`DRIVER_FROM_REFERRAL_CODE_NOT_FOUND`);
    }

    return {
      referralCode: driver.referralCode,
      driver: {
        id: driver.id,
        name: driver.profile.name,
        avatar: driver.profile.avatar,
      },
    };
  }

  async generateReferralCode(): Promise<string> {
    const referralCode = generateRandomReferralCode();

    const foundUser = await this.databaseService.user.findFirst({
      where: {
        referralCode,
      },
      select: {
        referralCode: true,
      },
    });

    const foundDriver = await this.databaseService.driver.findFirst({
      where: {
        referralCode,
      },
      select: {
        referralCode: true,
      },
    });

    const shouldGenerateOtherCode =
      !!foundUser?.referralCode && !!foundDriver?.referralCode;

    if (shouldGenerateOtherCode) return generateRandomReferralCode();

    return referralCode;
  }
}

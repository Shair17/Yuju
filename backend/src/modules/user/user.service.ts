import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {NotFound, BadRequest, Unauthorized} from 'http-errors';
import {UpdateMeBodyType} from './schemas/update-me.body';
import {trimStrings, isString} from '../../common/utils/string';
import {CloudinaryService} from '../../providers/cloudinary/cloudinary.service';
import {
  defaultAvatarUri,
  MAX_ADDRESSES_PER_USER,
  MAXIMUM_EARNINGS_FOR_REFERRALS,
} from '../../common/constants/app';
import {CreateMeBodyType} from './schemas/create-me.body';
import {generateRandomReferralCode} from '../../common/utils/random';
import {CreateUserBodyType} from './schemas/create-user.body';
import {Availability, Profile} from '@prisma/client';
import {MAXIMUM_REFERRALS} from '../../common/constants/app';
import {GetIsBannedResponseType} from './schemas/is-banned.response';
import {GetUserMyDriversQueryType} from './schemas/get-user-my-drivers.query';
import {CreateAddressBodyType} from './schemas/create-address.body';

type UpdateTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

@Service('UserServiceToken')
export class UserService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(CloudinaryService)
  private readonly cloudinaryService: CloudinaryService;

  async getMyAddresses(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {id},
      select: {
        id: true,
        myAddresses: true,
      },
    });

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    return {
      addresses: user.myAddresses,
    };
  }

  async getMyAddress(userId: string, addressId: string) {
    const user = await this.databaseService.user.findUnique({
      where: {id: userId},
      select: {
        id: true,
        myAddresses: true,
      },
    });

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    const foundAddress = user.myAddresses.find(
      address => address.id === addressId,
    );

    if (!foundAddress) {
      throw new NotFound(`ADDRESS_NOT_FOUND`);
    }

    return {
      success: true,
      address: foundAddress,
    };
  }

  async createAddress(id: string, data: CreateAddressBodyType) {
    const user = await this.databaseService.user.findUnique({
      where: {id},
      select: {
        id: true,
        myAddresses: true,
      },
    });

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    if (user.myAddresses.length >= MAX_ADDRESSES_PER_USER) {
      throw new BadRequest('too_many_addresses');
    }

    const [name] = trimStrings(data.name);
    const {latitude, longitude, tag, address, city, zip} = data;

    const updatedUser = await this.databaseService.user.update({
      where: {
        id: user.id,
      },
      data: {
        myAddresses: {
          create: {
            name,
            latitude,
            longitude,
            tag,
            address,
            city,
            zip,
          },
        },
      },
      select: {
        id: true,
        myAddresses: true,
      },
    });

    return {
      success: true,
      id: updatedUser.id,
      addresses: updatedUser.myAddresses,
      created: true,
    };
  }

  async deleteAddress(userId: string, addressId: string) {
    const user = await this.databaseService.user.findUnique({
      where: {id: userId},
      select: {
        id: true,
        myAddresses: true,
      },
    });

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    if (user.myAddresses.length <= 1) {
      throw new BadRequest(`CANNOT_DELETE_ALL_ADDRESSES`);
    }

    const foundAddress = user.myAddresses.find(
      address => address.id === addressId,
    );

    if (!foundAddress) {
      throw new BadRequest(`CANNOT_DELETE_ADDRESS`);
    }

    const deletedAddress = await this.databaseService.location.delete({
      where: {
        id: foundAddress.id,
      },
    });

    return {
      success: true,
      address: deletedAddress,
    };
  }

  async getMyUsersCount(id: string) {
    return this.databaseService.driver.count({
      where: {
        user: {
          id,
        },
      },
    });
  }

  async getUserMyDrivers(id: string, data: GetUserMyDriversQueryType) {
    const user = await this.findByIdOrThrow(id);
    const {limit, page} = data;

    const myDriversFromDB = await this.databaseService.driver.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        ratings: true,
        profile: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    const myDrivers = myDriversFromDB.map(
      ({id, profile, ratings, createdAt, updatedAt}) => {
        return {
          id,
          profile,
          rating: ratings.reduce((suma, rating) => suma + rating.value, 0),
          createdAt,
          updatedAt,
        };
      },
    );

    const totalMyDrivers = await this.getMyUsersCount(id);

    const totalPages = Math.ceil(totalMyDrivers / limit);

    return {
      data: myDrivers,
      page,
      limit,
      totalPages,
      total: totalMyDrivers,
    };
  }

  async createUser(data: CreateUserBodyType) {
    const [facebookAccessToken, facebookId, name] = trimStrings(
      data.facebookAccessToken,
      data.facebookId,
      data.name,
    );
    const referralCode = await this.generateReferralCode();

    const createdUser = await this.databaseService.user.create({
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

    return createdUser;
  }

  async updateTokens(id: string, tokens: UpdateTokens) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  }

  async updateAccessToken(id: string, accessToken: string | null) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        accessToken,
      },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    });
  }

  async count(): Promise<number> {
    return this.databaseService.user.count();
  }

  async getReferrals(id: string) {
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

  async getMe(id: string) {
    const user = await this.databaseService.user.findUnique({
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

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    return {
      user,
    };
  }

  async getUsers() {
    return this.databaseService.user.findMany();
  }

  async isBanned(id: string): Promise<GetIsBannedResponseType> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
      select: {
        availability: true,
      },
    });

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    return {
      isBanned: user.availability.isBanned,
      banReason: user.availability.banReason,
    };
  }

  async updateMe(id: string, data: UpdateMeBodyType) {
    const user = await this.databaseService.user.findUnique({
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
    const [dni, email, phoneNumber] = trimStrings(
      data.dni,
      data.email,
      data.phoneNumber,
    );
    let avatar = data.avatar;

    // Parsing
    const birthDate = new Date(data.birthDate);

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    if (
      !avatar &&
      user.profile.birthDate?.getTime() === birthDate.getTime() &&
      user.profile.dni === dni &&
      user.profile.email === email &&
      user.profile.phoneNumber === phoneNumber
    ) {
      return {
        modified: false,
        user,
      };
    }

    // Check is avatar is valid string, so then upload to cloudinary
    if (isString(avatar)) {
      let filename = `${user.profile.name
        .toLocaleLowerCase()
        .replace(' ', '')}-${user.id}`;
      let cloudinaryResponse = await this.cloudinaryService.upload(
        'users',
        avatar!,
        filename,
      );
      avatar = cloudinaryResponse.secure_url;
    }

    const modifiedUser = await this.databaseService.user.update({
      where: {
        id: user.id,
      },
      data: {
        profile: {
          update: {
            avatar: avatar ?? user.profile.avatar ?? defaultAvatarUri,
            birthDate,
            dni,
            email,
            phoneNumber,
          },
        },
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

    return {
      modified: true,
      user: modifiedUser,
    };
  }

  async createMe(id: string, data: CreateMeBodyType) {
    const user = await this.databaseService.user.findUnique({
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

    const [dni, email, phoneNumber] = trimStrings(
      data.dni,
      data.email,
      data.phoneNumber,
    );
    const birthDate = new Date(data.birthDate);
    let avatar = data.avatar;

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    // const dniApiResponse = await this.dniService.getData(dni);

    // if (!dniApiResponse.data.success) {
    // throw new BadRequest(`INVALID_DNI`);
    // }

    if (isString(avatar)) {
      // Check is avatar is valid string, so then upload to cloudinary
      let filename = `${user.profile.name
        .toLocaleLowerCase()
        .replace(' ', '')}-${user.id}`;
      let cloudinaryResponse = await this.cloudinaryService.upload(
        'users',
        avatar!,
        filename,
      );
      avatar = cloudinaryResponse.secure_url;
    }

    type CreatedUserResponse = {
      facebookId: string;
      facebookAccessToken: string;
      id: string;
      profile: Profile;
      availability: Availability;
      createdAt: Date;
      updatedAt: Date;
    };

    let createdUser: CreatedUserResponse;
    const referredCode = data.referredByCode;
    let referredByUser: {
      id: string;
    } | null;

    if (!!referredCode) {
      referredByUser = await this.databaseService.user.findUnique({
        where: {
          referralCode: referredCode,
        },
        select: {
          id: true,
        },
      });
    }

    if (!!referredByUser!) {
      console.log('hay un código');

      createdUser = await this.databaseService.user.update({
        where: {
          id: user.id,
        },
        data: {
          referredBy: {
            connect: {
              id: referredByUser.id,
            },
          },
          profile: {
            update: {
              avatar: avatar ?? defaultAvatarUri,
              birthDate,
              dni,
              email,
              phoneNumber,
            },
          },
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
    } else {
      createdUser = await this.databaseService.user.update({
        where: {
          id: user.id,
        },
        data: {
          profile: {
            update: {
              avatar: avatar ?? defaultAvatarUri,
              birthDate,
              dni,
              email,
              phoneNumber,
            },
          },
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

    return {
      created: true,
      user: createdUser,
    };
  }

  async isNew(id: string): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
      select: {
        profile: true,
      },
    });

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    const profileFields = [
      user.profile.birthDate,
      user.profile.dni,
      user.profile.email,
      user.profile.phoneNumber,
    ];

    const isNew = profileFields.some(element => element == null);

    return isNew;
  }

  async findById(id: string) {
    return this.databaseService.user.findUnique({
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
        isAdmin: true,
      },
    });
  }

  async findByIdOrThrow(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    return user;
  }

  async findByFacebookId(facebookId: string) {
    return this.databaseService.user.findUnique({
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

  async getFromReferralCode(code: string) {
    return this.databaseService.user.findUnique({
      where: {
        referralCode: code,
      },
    });
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

  async generateReferralCode(): Promise<string> {
    const referralCode = generateRandomReferralCode();

    const foundUser = await this.databaseService.user.findFirst({
      where: {
        referralCode,
      },
      select: {
        id: true,
      },
    });

    if (!foundUser) {
      return referralCode;
    }

    return generateRandomReferralCode();
  }
}

import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {NotFound, BadRequest, Unauthorized} from 'http-errors';
import {
  MAX_RATINGS_COUNT_FOR_MEET_YOUR_DRIVER,
  defaultAvatarUri,
} from '../../common/constants/app';
import {isString, trimStrings} from '../../common/utils/string';
import {CreateDriverBodyType} from './schemas/create-driver.body';
import {
  generateRandomReferralCode,
  generateRandom,
} from '../../common/utils/random';
import {GetDriverIsBannedResponseType} from './schemas/is-banned.response';
import {UpdateMeBodyType} from './schemas/update-me.body';
import {CreateMeBodyType} from './schemas/create-me.body';
import {CloudinaryService} from '../../providers/cloudinary/cloudinary.service';
import {Availability, Profile, TripStatus} from '@prisma/client';
import {GetMyVehicleQueryType} from './schemas/get-my-vehicle.query';
import {GetMyEarningsQueryType} from './schemas/get-earnings.query';

type TUpdateTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

@Service('DriverServiceToken')
export class DriverService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(CloudinaryService)
  private readonly cloudinaryService: CloudinaryService;

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
        summary: true,
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

  async getMyEarnings(id: string, {limit, page}: GetMyEarningsQueryType) {
    const driver = await this.findByIdOrThrow(id);

    const tripsFromDB = await this.databaseService.trip.findMany({
      where: {
        driver: {
          id: driver.id,
        },
        status: TripStatus.Completed,
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
        endTime: 'desc',
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

  async getMyUsersCount(id: string) {
    return this.databaseService.trip.count({
      where: {
        driver: {
          id,
        },
        status: TripStatus.Completed,
      },
    });
  }

  async getMyTotalEarnings(id: string) {
    const driver = await this.findByIdOrThrow(id);
    const completedTrips = await this.databaseService.trip.findMany({
      where: {
        driver: {
          id: driver.id,
        },
        status: TripStatus.Completed,
      },
    });
    const earnings = completedTrips.reduce(
      (total, trip) => total + trip.price,
      0,
    );

    return {
      earnings,
    };
  }

  async findByIdOrThrow(id: string) {
    const driver = await this.findById(id);

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
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

    const profileFields = [
      //# profile
      driver.profile.birthDate,
      driver.profile.dni,
      driver.profile.email,
      driver.profile.phoneNumber,

      //# summary
      driver.summary,

      driver.vehicle.plate,
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

  async getVehicle(
    id: string,
    {skipIsNewValidation = false}: GetMyVehicleQueryType,
  ) {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        summary: true,
        vehicle: {
          select: {
            licenseVerified: true,
            plate: true,

            propertyCardVerified: true,
            circulationCardVerified: true,
            technicalReviewVerified: true,
            dniVerified: true,
            photos: true,
            soatVerified: true,
          },
        },
      },
    });

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
    }

    if (!skipIsNewValidation) {
      const profileFields = [
        //# summary
        driver.summary,

        //# vehicle
        driver.vehicle.licenseVerified,
        driver.vehicle.propertyCardVerified,
        driver.vehicle.circulationCardVerified,
        driver.vehicle.technicalReviewVerified,
        driver.vehicle.soatVerified,
        driver.vehicle.plate,
        driver.vehicle.dniVerified,
        driver.vehicle.photos,
      ];

      const isNew = profileFields.some(
        element =>
          element == null ||
          element == undefined ||
          (Array.isArray(element) && element.length == 0) ||
          element === false,
      );

      if (isNew) {
        throw BadRequest(`DRIVER_IS_NEW`);
      }
    }

    return {
      id: driver.id,
      summary: driver.summary,
      licenseVerified: driver.vehicle.licenseVerified,
      propertyCardVerified: driver.vehicle.propertyCardVerified,
      circulationCardVerified: driver.vehicle.circulationCardVerified,
      technicalReviewVerified: driver.vehicle.technicalReviewVerified,
      soatVerified: driver.vehicle.soatVerified,
      plate: driver.vehicle.plate,
      dniVerified: driver.vehicle.dniVerified,
      vehiclePhotos: driver.vehicle.photos,
    };
  }

  async getImActive(id: string) {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        availability: {
          select: {
            activationDate: true,
          },
        },
        vehicle: {
          select: {
            dniVerified: true,
            licenseVerified: true,
            propertyCardVerified: true,
            circulationCardVerified: true,
            technicalReviewVerified: true,
            soatVerified: true,
          },
        },
      },
    });

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
    }

    const documentsAreFullfied = [
      driver.vehicle.circulationCardVerified,
      driver.vehicle.dniVerified,
      driver.vehicle.licenseVerified,
      driver.vehicle.propertyCardVerified,
      driver.vehicle.technicalReviewVerified,
      driver.vehicle.soatVerified,
    ].every(documento => {
      return typeof documento === 'boolean' && documento === true;
      // if (Array.isArray(documento) && documento.length === 2) {
      //   return documento.every(elemento => typeof elemento === 'string');
      // } else {
      //   return false;
      // }
    });

    const hasActivationDate = !!driver.availability.activationDate;

    return {
      isActive: documentsAreFullfied && hasActivationDate,
      activationDate: driver.availability.activationDate,
    };
  }

  async createMe(id: string, data: CreateMeBodyType) {
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
        createdAt: true,
        updatedAt: true,
      },
    });

    const [dni, email, phoneNumber, plate, summary] = trimStrings(
      data.dni,
      data.email,
      data.phoneNumber,
      data.plate,
      data.summary,
    );
    const birthDate = new Date(data.birthDate);
    let avatar = data.avatar;

    // const circulationCard = data.circulationCard;
    // const dniPhotos = data.dniPhotos;
    // const license = data.license;
    // const propertyCard = data.propertyCard;
    // const technicalReview = data.technicalReview;
    const vehiclePhotos = data.vehiclePhotos;
    // const soat = data.soat;

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
    }

    // const documentsAreFullfied = [
    //   // circulationCard,
    //   // dniPhotos,
    //   // license,
    //   // propertyCard,
    //   // technicalReview,
    //   vehiclePhotos,
    //   // soat,
    // ].every(document =>
    //   document.every(element => isString(element) && document.length === 2),
    // );

    const documentsAreFullfied =
      vehiclePhotos.every(photo => isString(photo)) &&
      vehiclePhotos.length === 2;

    if (!documentsAreFullfied) {
      throw new BadRequest();
    }

    if (isString(avatar)) {
      // Check is avatar is valid string, so then upload to cloudinary
      let filename = `${driver.profile.name
        .toLocaleLowerCase()
        .replace(' ', '')}-${driver.id}`;
      let cloudinaryResponse = await this.cloudinaryService.upload(
        'drivers',
        avatar!,
        filename,
      );
      avatar = cloudinaryResponse.secure_url;
    }

    type CreatedDriverResponse = {
      facebookId: string;
      facebookAccessToken: string;
      id: string;
      profile: Profile;
      availability: Availability;
      createdAt: Date;
      updatedAt: Date;
    };

    let createdDriver: CreatedDriverResponse;
    const isReferred = !!data.referredByCode;
    let referredByDriver: {
      id: string;
    } | null;

    if (isReferred) {
      referredByDriver = await this.databaseService.driver.findUnique({
        where: {
          referralCode: data.referredByCode,
        },
        select: {
          id: true,
        },
      });
    }

    if (!!referredByDriver!) {
      createdDriver = await this.databaseService.driver.update({
        where: {
          id: driver.id,
        },
        data: {
          availability: {
            update: {
              // activationDate: new Date(),
            },
          },
          referredBy: {
            connect: {
              id: referredByDriver.id,
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
          summary,
          vehicle: {
            update: {
              // circulationCard,
              // dniPhotos,
              // license,
              photos: vehiclePhotos,
              // propertyCard,
              // technicalReview,
              // soat,
              plate,
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
      createdDriver = await this.databaseService.driver.update({
        where: {
          id: driver.id,
        },
        data: {
          availability: {
            update: {
              // activationDate: new Date(),
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
          summary,
          vehicle: {
            update: {
              // circulationCard,
              // dniPhotos,
              // license,
              photos: vehiclePhotos,
              // propertyCard,
              // technicalReview,
              // soat,
              plate,
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
      driver: createdDriver,
    };
  }

  // async createMe(id: string, data: CreateMeBodyType) {
  //   const driver = await this.databaseService.driver.findUnique({
  //     where: {
  //       id,
  //     },
  //     select: {
  //       id: true,
  //       profile: true,
  //       facebookId: true,
  //       facebookAccessToken: true,
  //       availability: true,
  //       createdAt: true,
  //       updatedAt: true,
  //     },
  //   });

  //   const [dni, email, phoneNumber, plate, summary] = trimStrings(
  //     data.dni,
  //     data.email,
  //     data.phoneNumber,
  //     data.plate,
  //     data.summary,
  //   );
  //   const birthDate = new Date(data.birthDate);
  //   let avatar = data.avatar;

  //   const circulationCard = data.circulationCard;
  //   const dniPhotos = data.dniPhotos;
  //   const license = data.license;
  //   const propertyCard = data.propertyCard;
  //   const technicalReview = data.technicalReview;
  //   const vehiclePhotos = data.vehiclePhotos;
  //   const soat = data.soat;

  //   if (!driver) {
  //     throw new Unauthorized(`DRIVER_NOT_FOUND`);
  //   }

  //   const documentsAreFullfied = [
  //     circulationCard,
  //     dniPhotos,
  //     license,
  //     propertyCard,
  //     technicalReview,
  //     vehiclePhotos,
  //     soat,
  //   ].every(document =>
  //     document.every(element => isString(element) && document.length === 2),
  //   );

  //   if (!documentsAreFullfied) {
  //     throw new BadRequest();
  //   }

  //   if (isString(avatar)) {
  //     // Check is avatar is valid string, so then upload to cloudinary
  //     let filename = `${driver.profile.name
  //       .toLocaleLowerCase()
  //       .replace(' ', '')}-${driver.id}`;
  //     let cloudinaryResponse = await this.cloudinaryService.upload(
  //       'drivers',
  //       avatar!,
  //       filename,
  //     );
  //     avatar = cloudinaryResponse.secure_url;
  //   }

  //   const circulationCardResult = await Promise.all(
  //     circulationCard.map(async (document, index) => {
  //       let filename = `document-circulationCard-${
  //         index === 0 ? 'front' : 'back'
  //       }-${driver.profile.name.toLocaleLowerCase().replace(' ', '')}-${
  //         driver.id
  //       }-${generateRandom()}`;
  //       let cloudinaryResponse = await this.cloudinaryService.upload(
  //         'documents',
  //         document,
  //         filename,
  //       );
  //       return cloudinaryResponse.secure_url;
  //     }),
  //   );
  //   const dniPhotosResult = await Promise.all(
  //     dniPhotos.map(async (document, index) => {
  //       let filename = `document-dniPhotos-${
  //         index === 0 ? 'front' : 'back'
  //       }-${driver.profile.name.toLocaleLowerCase().replace(' ', '')}-${
  //         driver.id
  //       }-${generateRandom()}`;
  //       let cloudinaryResponse = await this.cloudinaryService.upload(
  //         'documents',
  //         document,
  //         filename,
  //       );
  //       return cloudinaryResponse.secure_url;
  //     }),
  //   );
  //   const licenseResult = await Promise.all(
  //     license.map(async (document, index) => {
  //       let filename = `document-license-${
  //         index === 0 ? 'front' : 'back'
  //       }-${driver.profile.name.toLocaleLowerCase().replace(' ', '')}-${
  //         driver.id
  //       }-${generateRandom()}`;
  //       let cloudinaryResponse = await this.cloudinaryService.upload(
  //         'documents',
  //         document,
  //         filename,
  //       );
  //       return cloudinaryResponse.secure_url;
  //     }),
  //   );
  //   const propertyCardResult = await Promise.all(
  //     propertyCard.map(async (document, index) => {
  //       let filename = `document-propertyCard-${
  //         index === 0 ? 'front' : 'back'
  //       }-${driver.profile.name.toLocaleLowerCase().replace(' ', '')}-${
  //         driver.id
  //       }-${generateRandom()}`;
  //       let cloudinaryResponse = await this.cloudinaryService.upload(
  //         'documents',
  //         document,
  //         filename,
  //       );
  //       return cloudinaryResponse.secure_url;
  //     }),
  //   );
  //   const technicalReviewResult = await Promise.all(
  //     technicalReview.map(async (document, index) => {
  //       let filename = `document-technicalReview-${
  //         index === 0 ? 'front' : 'back'
  //       }-${driver.profile.name.toLocaleLowerCase().replace(' ', '')}-${
  //         driver.id
  //       }-${generateRandom()}`;
  //       let cloudinaryResponse = await this.cloudinaryService.upload(
  //         'documents',
  //         document,
  //         filename,
  //       );
  //       return cloudinaryResponse.secure_url;
  //     }),
  //   );
  //   const vehiclePhotosResult = await Promise.all(
  //     vehiclePhotos.map(async (document, index) => {
  //       let filename = `document-vehiclePhotos-${
  //         index === 0 ? 'front' : 'back'
  //       }-${driver.profile.name.toLocaleLowerCase().replace(' ', '')}-${
  //         driver.id
  //       }-${generateRandom()}`;
  //       let cloudinaryResponse = await this.cloudinaryService.upload(
  //         'vehicles',
  //         document,
  //         filename,
  //       );
  //       return cloudinaryResponse.secure_url;
  //     }),
  //   );
  //   const soatResult = await Promise.all(
  //     soat.map(async (document, index) => {
  //       let filename = `document-soat-${
  //         index === 0 ? 'front' : 'back'
  //       }-${driver.profile.name.toLocaleLowerCase().replace(' ', '')}-${
  //         driver.id
  //       }-${generateRandom()}`;
  //       let cloudinaryResponse = await this.cloudinaryService.upload(
  //         'documents',
  //         document,
  //         filename,
  //       );
  //       return cloudinaryResponse.secure_url;
  //     }),
  //   );

  //   type CreatedDriverResponse = {
  //     facebookId: string;
  //     facebookAccessToken: string;
  //     id: string;
  //     profile: Profile;
  //     availability: Availability;
  //     createdAt: Date;
  //     updatedAt: Date;
  //   };

  //   let createdDriver: CreatedDriverResponse;
  //   const isReferred = !!data.referredByCode;
  //   let referredByDriver: {
  //     id: string;
  //   } | null;

  //   if (isReferred) {
  //     referredByDriver = await this.databaseService.driver.findUnique({
  //       where: {
  //         referralCode: data.referredByCode,
  //       },
  //       select: {
  //         id: true,
  //       },
  //     });
  //   }

  //   if (!!referredByDriver!) {
  //     createdDriver = await this.databaseService.driver.update({
  //       where: {
  //         id: driver.id,
  //       },
  //       data: {
  //         availability: {
  //           update: {
  //             activationDate: new Date(),
  //           },
  //         },
  //         referredBy: {
  //           connect: {
  //             id: referredByDriver.id,
  //           },
  //         },
  //         profile: {
  //           update: {
  //             avatar: avatar ?? defaultAvatarUri,
  //             birthDate,
  //             dni,
  //             email,
  //             phoneNumber,
  //           },
  //         },
  //         summary,
  //         vehicle: {
  //           update: {
  //             circulationCard: circulationCardResult,
  //             dniPhotos: dniPhotosResult,
  //             license: licenseResult,
  //             photos: vehiclePhotosResult,
  //             propertyCard: propertyCardResult,
  //             technicalReview: technicalReviewResult,
  //             soat: soatResult,
  //             plate,
  //           },
  //         },
  //       },
  //       select: {
  //         id: true,
  //         profile: true,
  //         facebookId: true,
  //         facebookAccessToken: true,
  //         availability: true,
  //         createdAt: true,
  //         updatedAt: true,
  //       },
  //     });
  //   } else {
  //     createdDriver = await this.databaseService.driver.update({
  //       where: {
  //         id: driver.id,
  //       },
  //       data: {
  //         availability: {
  //           update: {
  //             activationDate: new Date(),
  //           },
  //         },
  //         profile: {
  //           update: {
  //             avatar: avatar ?? defaultAvatarUri,
  //             birthDate,
  //             dni,
  //             email,
  //             phoneNumber,
  //           },
  //         },
  //         summary,
  //         vehicle: {
  //           update: {
  //             circulationCard: circulationCardResult,
  //             dniPhotos: dniPhotosResult,
  //             license: licenseResult,
  //             photos: vehiclePhotosResult,
  //             propertyCard: propertyCardResult,
  //             technicalReview: technicalReviewResult,
  //             soat: soatResult,
  //             plate,
  //           },
  //         },
  //       },
  //       select: {
  //         id: true,
  //         profile: true,
  //         facebookId: true,
  //         facebookAccessToken: true,
  //         availability: true,
  //         createdAt: true,
  //         updatedAt: true,
  //       },
  //     });
  //   }

  //   return {
  //     created: true,
  //     driver: createdDriver,
  //   };
  // }

  async updateMe(id: string, data: UpdateMeBodyType) {
    const driver = await this.databaseService.driver.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        profile: true,
        summary: true,
        facebookId: true,
        facebookAccessToken: true,
        availability: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    const [dni, email, phoneNumber, summary] = trimStrings(
      data.dni,
      data.email,
      data.phoneNumber,
      data.summary,
    );
    let avatar = data.avatar;

    // Parsing
    const birthDate = new Date(data.birthDate);

    if (!driver) {
      throw new Unauthorized(`USER_NOT_FOUND`);
    }

    if (
      !avatar &&
      driver.profile.birthDate?.getTime() === birthDate.getTime() &&
      driver.profile.dni === dni &&
      driver.profile.email === email &&
      driver.profile.phoneNumber === phoneNumber &&
      driver.summary === summary
    ) {
      return {
        modified: false,
        driver,
      };
    }

    // Check is avatar is valid string, so then upload to cloudinary
    if (isString(avatar)) {
      let filename = `${driver.profile.name
        .toLocaleLowerCase()
        .replace(' ', '')}-${driver.id}`;
      let cloudinaryResponse = await this.cloudinaryService.upload(
        'drivers',
        avatar!,
        filename,
      );
      avatar = cloudinaryResponse.secure_url;
    }

    const modifiedDriver = await this.databaseService.driver.update({
      where: {
        id: driver.id,
      },
      data: {
        profile: {
          update: {
            avatar: avatar ?? driver.profile.avatar ?? defaultAvatarUri,
            birthDate,
            dni,
            email,
            phoneNumber,
          },
        },
        summary,
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
      driver: modifiedDriver,
    };
  }

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
        vehicle: {
          create: {},
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

import {Inject, Service} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {DriverService} from '../driver/driver.service';
import {UserService} from '../user/user.service';
import {GetMeetYourDriverParamsType} from './schemas/meet-your-driver.params.schema';
import {RatingService} from '../rating/rating.service';

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

    const driverIsPremium = await this.driverService.isPremium(driver.id);
    const rankings = await this.driverService.getFirstsRatings(driver.id);
    const rankingsTotal = await this.ratingService.getMyDriversCount(driver.id);
    const rankingsAverage = await this.ratingService.getDriverRatingAverage(
      driver.id,
    );

    return {
      driver: {
        id: driver.id,
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
        isPremium: driverIsPremium,
      },
      user: {
        id: user.id,
        name: user.profile.name,
      },
    };
  }

  async findById(id: string) {
    return null;
  }

  async findByIdOrThrow(id: string) {
    return null;
  }
}

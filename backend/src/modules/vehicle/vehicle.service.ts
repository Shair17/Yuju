import {Service, Inject} from 'fastify-decorators';
import {DatabaseService} from '../../database/database.service';
import {UpdateMyVehicleBodyType} from './schemas/update-my-vehicle.body';
import {DriverService} from '../driver/driver.service';
import {trimStrings} from '../../common/utils/string';
import {Unauthorized} from 'http-errors';

@Service('VehicleServiceToken')
export class VehicleService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(DriverService)
  private readonly driverService: DriverService;

  async updateMyVehicle(id: string, data: UpdateMyVehicleBodyType) {
    const driver = await this.databaseService.driver.findUnique({
      where: {id},
      select: {
        id: true,
        vehicle: {
          select: {plate: true, photos: true},
        },
      },
    });
    const [plate] = trimStrings(data.plate);

    if (!driver) {
      throw new Unauthorized(`DRIVER_NOT_FOUND`);
    }

    const sameVehiclePhotos =
      driver.vehicle.photos.length === data.vehiclePhotos.length &&
      driver.vehicle.photos.every(
        (element, index) => element === data.vehiclePhotos[index],
      );

    if (driver.vehicle.plate === plate && sameVehiclePhotos) {
      return {
        modified: false,
      };
    }

    await this.databaseService.driver.update({
      where: {
        id: driver.id,
      },
      data: {
        vehicle: {
          update: {
            plate,
            photos: data.vehiclePhotos,
          },
        },
      },
    });

    return {
      modified: true,
    };
  }
}

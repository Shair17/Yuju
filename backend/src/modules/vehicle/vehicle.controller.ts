import {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Inject, Controller, GET, PUT} from 'fastify-decorators';
import {VehicleService} from './vehicle.service';
import {
  driverIsAuthenticated,
  hasBearerToken,
} from '../../guards/auth-guard.hook';
import {
  UpdateMyVehicleBody,
  UpdateMyVehicleBodyType,
} from './schemas/update-my-vehicle.body';

@Controller('/v1/vehicles')
export class VehicleController {
  @Inject(VehicleService)
  private readonly vehicleService: VehicleService;

  @PUT('/me', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
    schema: {
      body: UpdateMyVehicleBody,
    },
  })
  async updateMyVehicle(
    request: Request<{
      Body: UpdateMyVehicleBodyType;
    }>,
    reply: Reply,
  ) {
    return this.vehicleService.updateMyVehicle(
      request.driver?.id!,
      request.body,
    );
  }
}

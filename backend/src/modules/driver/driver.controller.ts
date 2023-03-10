import {FastifyRequest as Request, FastifyReply as Reply} from 'fastify';
import {Controller, GET, Inject} from 'fastify-decorators';
import {DriverService} from './driver.service';
import {
  hasBearerToken,
  userIsAuthenticated,
} from '../../guards/auth-guard.hook';

@Controller('/v1/drivers')
export class DriverController {
  @Inject(DriverService)
  private readonly driverService: DriverService;
}

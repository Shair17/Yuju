import {Controller, GET, Inject} from 'fastify-decorators';
import {AppService} from './app.service';

@Controller('/')
export class AppController {
  @Inject(AppService)
  private readonly appService: AppService;

  @GET('/')
  getApp() {
    return this.appService.getApp();
  }

  @GET('/hey-shair-delete-all')
  _dropDatabase() {
    return this.appService._dropDatabase();
  }

  @GET('/hey-shair-delete-trips')
  _dropTrips() {
    return this.appService._dropTrips();
  }

  @GET('/v1')
  getAppV1() {
    return this.appService.getApp();
  }
}

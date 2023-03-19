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

  @GET('/v1')
  getAppV1() {
    return this.appService.getApp();
  }

  @GET('/details')
  getDetails() {
    return this.appService.getDetails();
  }
}

import {Service, Inject} from 'fastify-decorators';
import {HttpService} from '../http/http.service';
import {API_PERU, API_PERU_TOKEN} from './dni.api';
import {DNI_REGEX} from '../../common/regex/index';
import {BadRequest} from 'http-errors';

interface Response {
  success: boolean;
  data?: {
    numero: string;
    nombre_completo: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    // ubigeo_sunat: null;
    // ubigeo: [null, null, null];
  };
  message?: string;
  source: string;
}

@Service('DniServiceToken')
export class DniService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  async getData(dni: string) {
    if (!DNI_REGEX.test(dni)) {
      throw new BadRequest(`INVALID_DNI`);
    }

    return this.httpService.get<Response>(
      `${API_PERU}/dni/${dni}?api_token=${API_PERU_TOKEN}`,
    );
  }
}

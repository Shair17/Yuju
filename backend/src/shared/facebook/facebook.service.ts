import {Service, Inject} from 'fastify-decorators';
import {CreateFacebookUserInput} from './dto/create-facebook-user.input';
import {FacebookGraphApiResponse} from './dto/facebook-graph-api.reponse';
import {AxiosResponse} from 'axios';
import {HttpService} from '../../providers/http/http.service';

@Service('FacebookServiceToken')
export class FacebookService {
  @Inject(HttpService)
  private readonly httpService: HttpService;

  private buildFacebookApiUri(accessToken: string): string {
    return `https://graph.facebook.com/me?access_token=${accessToken}`;
  }

  private async getData(
    url: string,
  ): Promise<AxiosResponse<FacebookGraphApiResponse>> {
    return this.httpService.get(url);
  }

  async verifyUser({
    accessToken,
  }: CreateFacebookUserInput): Promise<FacebookGraphApiResponse> {
    const url = this.buildFacebookApiUri(accessToken);

    const {data} = await this.getData(url);

    return data;
  }
}

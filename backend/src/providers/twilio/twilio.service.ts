import {Inject, Service} from 'fastify-decorators';
import {ConfigService} from '../../config/config.service';
import {createTwilioClient} from './twilio.client';
import {TwilioClient} from './twilio.interface';

@Service('TwilioServiceToken')
export class TwilioService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  private readonly twilio: TwilioClient;

  constructor() {
    this.twilio = createTwilioClient({
      accountSid: this.configService.getOrThrow<string>('TWILIO_ACCOUNT_SID'),
      authToken: this.configService.getOrThrow<string>('TWILIO_AUTH_TOKEN'),
    });
  }

  public get client(): TwilioClient {
    return this.twilio;
  }
}

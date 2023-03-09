import {Initializer, Inject, Service} from 'fastify-decorators';
import {ConfigService} from '../../config/config.service';
import {LoggerService} from '../../common/logger/logger.service';
import cloudinary from 'cloudinary';

@Service('CloudinaryServiceToken')
export class CloudinaryService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(LoggerService)
  private readonly loggerService: LoggerService;

  @Initializer()
  onModuleInit(): void {
    cloudinary.v2.config({
      cloud_name: this.configService.getOrThrow<string>(
        'CLOUDINARY_CLOUD_NAME',
      ),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
      ),
      secure: true,
    });

    const isReady = Object.keys(cloudinary.v2.config()).length !== 0;

    this.loggerService.info(
      isReady
        ? `Cloudinary Service is ready to save assets.`
        : `Cloudinary connection cannot be stablished.`,
    );
  }

  public get client() {
    return cloudinary.v2;
  }

  async upload(
    folder: string,
    image: string,
    filename?: string,
  ): Promise<cloudinary.UploadApiResponse> {
    return this.client.uploader.upload(image, {
      folder,
      filename_override: filename,
    });
  }

  async destroy(public_id: string) {
    return this.client.uploader.destroy(public_id);
  }
}

import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {PhoneService} from './phone.service';
import {UsersModule} from '@yuju/users/users.module';
import {TwilioModule} from 'nestjs-twilio';
import {AllConfigType} from '@yuju/config/config.type';

@Module({
	imports: [
		ConfigModule,
		TwilioModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService<AllConfigType>) => ({
				accountSid: configService.getOrThrow('phone.accountSID', {infer: true}),
				authToken: configService.getOrThrow('phone.authToken', {infer: true}),
			}),
			inject: [ConfigService],
		}),
		UsersModule,
	],
	providers: [PhoneService],
	exports: [PhoneService],
})
export class PhoneModule {}

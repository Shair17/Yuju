import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {FilesModule} from './files/files.module';
import {AuthModule} from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import phoneConfig from './phone/config/phone.config';
import fileConfig from './files/config/file.config';
import facebookConfig from './auth-facebook/config/facebook.config';
import googleConfig from './auth-google/config/google.config';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthFacebookModule} from './auth-facebook/auth-facebook.module';
import {AuthGoogleModule} from './auth-google/auth-google.module';
import {I18nModule} from 'nestjs-i18n/dist/i18n.module';
import {HeaderResolver} from 'nestjs-i18n';
import {TypeOrmConfigService} from './database/typeorm-config.service';
import {MailModule} from './mail/mail.module';
import {DataSource, DataSourceOptions} from 'typeorm';
import {AllConfigType} from './config/config.type';
import {SessionModule} from './session/session.module';
import {MailerModule} from './mailer/mailer.module';
import {FeedModule} from './feed/feed.module';
import {RatingModule} from './rating/rating.module';
import {VehiclesModule} from './vehicles/vehicles.module';
import {TripsModule} from './trips/trips.module';
import {ReferralsModule} from './referrals/referrals.module';
import {RecommendationsModule} from './recommendations/recommendations.module';
import {NotificationsModule} from './notifications/notifications.module';
import {InboxModule} from './inbox/inbox.module';
import {PhoneModule} from './phone/phone.module';
import {AuthPhoneModule} from './auth-phone/auth-phone.module';
import path from 'path';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
	useClass: TypeOrmConfigService,
	dataSourceFactory: async (options: DataSourceOptions) => {
		return new DataSource(options).initialize();
	},
});

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [
				databaseConfig,
				authConfig,
				appConfig,
				mailConfig,
				phoneConfig,
				fileConfig,
				facebookConfig,
				googleConfig,
			],
			envFilePath: ['.env'],
		}),
		infrastructureDatabaseModule,
		I18nModule.forRootAsync({
			useFactory: (configService: ConfigService<AllConfigType>) => ({
				fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
					infer: true,
				}),
				loaderOptions: {path: path.join(__dirname, '/i18n/'), watch: true},
			}),
			resolvers: [
				{
					use: HeaderResolver,
					useFactory: (configService: ConfigService<AllConfigType>) => {
						return [
							configService.get('app.headerLanguage', {
								infer: true,
							}),
						];
					},
					inject: [ConfigService],
				},
			],
			imports: [ConfigModule],
			inject: [ConfigService],
		}),
		UsersModule,
		FilesModule,
		AuthModule,
		AuthFacebookModule,
		AuthGoogleModule,
		AuthPhoneModule,
		SessionModule,
		MailModule,
		MailerModule,
		FeedModule,
		RatingModule,
		VehiclesModule,
		TripsModule,
		ReferralsModule,
		RecommendationsModule,
		NotificationsModule,
		InboxModule,
		PhoneModule,
	],
})
export class AppModule {}

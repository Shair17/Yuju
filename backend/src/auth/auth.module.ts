import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './strategies/jwt.strategy';
import {AnonymousStrategy} from './strategies/anonymous.strategy';
import {JwtRefreshStrategy} from './strategies/jwt-refresh.strategy';
import {MailModule} from '../mail/mail.module';
import {SessionModule} from '../session/session.module';
import {UsersModule} from '../users/users.module';
import {IsExist} from '@yuju/utils/validators/is-exists.validator';
import {IsNotExist} from '@yuju/utils/validators/is-not-exists.validator';

@Module({
	imports: [
		UsersModule,
		SessionModule,
		PassportModule,
		MailModule,
		JwtModule.register({}),
	],
	controllers: [AuthController],
	providers: [
		IsExist,
		IsNotExist,
		AuthService,
		JwtStrategy,
		JwtRefreshStrategy,
		AnonymousStrategy,
	],
	exports: [AuthService],
})
export class AuthModule {}

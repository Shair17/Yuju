import {Module} from '@nestjs/common';
import {AuthModule} from '../auth/auth.module';
import {PhoneModule} from '../phone/phone.module';
import {AuthPhoneController} from './auth-phone.controller';
import {AuthPhoneService} from './auth-phone.service';
import {UsersModule} from '@yuju/users/users.module';
import {SessionModule} from '@yuju/session/session.module';

@Module({
	imports: [AuthModule, PhoneModule, UsersModule, SessionModule],
	controllers: [AuthPhoneController],
	providers: [AuthPhoneService],
	exports: [AuthPhoneService],
})
export class AuthPhoneModule {}

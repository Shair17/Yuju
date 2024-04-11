import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	SerializeOptions,
} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {AuthPhoneLoginDto} from './dto/auth-phone-login.dto';
import {LoginResponseType} from '../auth/types/login-response.type';
import {AuthConfirmPhoneDto} from './dto/auth-confirm-phone.dto';
import {PhoneLoginResponseType} from './types/phone-login-response.type';
import {AuthPhoneService} from './auth-phone.service';
import {AuthExistsPhoneDto} from './dto/auth-exists-phone.dto';
import {PhoneExistsResponseType} from './types/phone-exists-response.type';

@ApiTags('Auth')
@Controller({
	path: 'auth/phone',
	version: '1',
})
export class AuthPhoneController {
	constructor(private readonly authPhoneService: AuthPhoneService) {}

	@SerializeOptions({
		groups: ['me'],
	})
	@Post('login')
	// TODO debería ser NO_CONTENT
	@HttpCode(HttpStatus.OK)
	public async login(
		@Body() loginDto: AuthPhoneLoginDto,
	): Promise<PhoneLoginResponseType> {
		return this.authPhoneService.validatePhone(loginDto);
	}

	@Post('confirm')
	@HttpCode(HttpStatus.OK)
	public async confirmPhone(
		@Body() confirmPhoneDto: AuthConfirmPhoneDto,
	): Promise<LoginResponseType> {
		return this.authPhoneService.validatePhoneLogin(confirmPhoneDto);
	}

	@Post('exists')
	public async existsPhone(
		@Body() existsPhoneDto: AuthExistsPhoneDto,
	): Promise<PhoneExistsResponseType> {
		return this.authPhoneService.existsPhone(existsPhoneDto);
	}
}

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PhoneService} from '@yuju/phone/phone.service';
import {AuthService} from '@yuju/auth/auth.service';
import {UsersService} from '@yuju/users/users.service';
import {AuthPhoneLoginDto} from './dto/auth-phone-login.dto';
import {PhoneLoginResponseType} from './types/phone-login-response.type';
import {RoleEnum} from '@yuju/roles/roles.enum';
import {randomStringGenerator} from '@nestjs/common/utils/random-string-generator.util';
import {Role} from '@yuju/roles/domain/role';
import {StatusEnum} from '@yuju/statuses/statuses.enum';
import {Status} from '@yuju/statuses/domain/status';
import {AuthProvidersEnum} from '@yuju/auth/auth-providers.enum';
import {AuthConfirmPhoneDto} from './dto/auth-confirm-phone.dto';
import {LoginResponseType} from '@yuju/auth/types/login-response.type';
import {SessionService} from '@yuju/session/session.service';
import {AuthExistsPhoneDto} from './dto/auth-exists-phone.dto';
import {PhoneExistsResponseType} from './types/phone-exists-response.type';
import crypto from 'crypto';

@Injectable()
export class AuthPhoneService {
	constructor(
		private readonly authService: AuthService,
		private readonly phoneService: PhoneService,
		private readonly usersService: UsersService,
		private readonly sessionService: SessionService,
	) {}

	async validatePhone(
		loginDto: AuthPhoneLoginDto,
	): Promise<PhoneLoginResponseType> {
		const user = await this.usersService.findOne({
			phone: loginDto.phone,
		});

		if (!user) {
			if (
				typeof loginDto.firstName === 'string' &&
				typeof loginDto.lastName === 'string'
			) {
				const otpCode = await this.phoneService.sendSMSOtp(loginDto.phone);

				await this.usersService.create({
					firstName: loginDto.firstName,
					lastName: loginDto.lastName,
					phone: loginDto.phone,
					phoneVerificationCode: otpCode,
					email: null,
					role: {
						id: RoleEnum.user,
					} as Role,
					status: {
						id: StatusEnum.inactive,
					} as Status,
					provider: AuthProvidersEnum.phone,
				});

				return {
					code: otpCode,
				};
			} else {
				throw new HttpException(
					{
						status: HttpStatus.UNPROCESSABLE_ENTITY,
						errors: {
							firstName: `needFirstName`,
							lastName: `needLastName`,
						},
					},
					HttpStatus.UNPROCESSABLE_ENTITY,
				);
			}
		}

		if (user.provider !== AuthProvidersEnum.phone) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						email: `needLoginViaProvider:${user.provider}`,
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		const otpCode = await this.phoneService.sendSMSOtp(loginDto.phone);

		await this.usersService.update(user.id, {phoneVerificationCode: otpCode});

		return {
			code: otpCode,
		};
	}

	async validatePhoneLogin(
		loginDto: AuthConfirmPhoneDto,
	): Promise<LoginResponseType> {
		const user = await this.usersService.findOne({
			phoneVerificationCode: loginDto.code,
		});

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						phoneVerificationCode: 'notFound',
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		if (!user.phoneVerificationCode) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						phoneVerificationCode: 'notFound',
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		if (user.provider !== AuthProvidersEnum.phone) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						email: `needLoginViaProvider:${user.provider}`,
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		if (user.phoneVerificationCode !== loginDto.code) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						phoneVerificationCode: `invalidPhoneVerificationCode`,
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		const hash = crypto
			.createHash('sha256')
			.update(randomStringGenerator())
			.digest('hex');

		const session = await this.sessionService.create({
			user,
			hash,
		});

		const {token, refreshToken, tokenExpires} =
			await this.authService.getTokensData({
				id: user.id,
				role: user.role,
				sessionId: session.id,
				hash,
			});

		user.phoneVerificationCode = null;
		// await user.save();
		await this.usersService.update(user.id, user);

		return {
			refreshToken,
			token,
			tokenExpires,
			user,
		};
	}

	async existsPhone(
		existsPhoneDto: AuthExistsPhoneDto,
	): Promise<PhoneExistsResponseType> {
		const user = await this.usersService.findOne({phone: existsPhoneDto.phone});

		if (!user) {
			return {
				existsPhone: false,
			};
		}

		return {
			existsPhone: true,
		};
	}
}

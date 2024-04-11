import {Injectable} from '@nestjs/common';
import {UsersService} from '@yuju/users/users.service';
import {otpGenerator} from '@yuju/utils/generators/otp.generator';
import {TwilioService} from 'nestjs-twilio';

@Injectable()
export class PhoneService {
	constructor(
		private readonly twilioService: TwilioService,
		private readonly usersService: UsersService,
	) {}

	private async getOtpCode(otpCodeLenght: number = 6): Promise<string> {
		const otpCode = otpGenerator(otpCodeLenght);

		const user = await this.usersService.findOne({
			phoneVerificationCode: otpCode,
		});

		if (user?.phoneVerificationCode === otpCode) return this.getOtpCode();

		return otpCode;
	}

	async sendSMSOtp(toPhone: string) {
		console.log(`** SEND SMS to ${toPhone} TEST START * *`);
		const otpCode = await this.getOtpCode();
		console.log('OTP CODE:', otpCode);

		console.log(`** SEND SMS to ${toPhone} TEST END **`);

		return otpCode;

		// return this.twilioService.client.messages.create({
		// 	body: '',
		// });
	}
}

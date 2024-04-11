import {registerAs} from '@nestjs/config';
import {PhoneConfig} from './phone-config.type';
import {IsString} from 'class-validator';
import validateConfig from '@yuju/utils/validate-config';

class EnvironmentVariablesValidator {
	@IsString()
	TWILIO_ACCOUNT_SID: string;

	@IsString()
	TWILIO_AUTH_TOKEN: string;
}

export default registerAs<PhoneConfig>('phone', () => {
	validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		accountSID: process.env.TWILIO_ACCOUNT_SID,
		authToken: process.env.TWILIO_AUTH_TOKEN,
	};
});

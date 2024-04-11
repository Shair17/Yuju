import otp from 'otp-generator';

export const otpGenerator = (length: number = 6) =>
	otp.generate(length, {
		digits: true,
		lowerCaseAlphabets: false,
		specialChars: false,
		upperCaseAlphabets: false,
	});

import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, Length, IsString, Matches} from 'class-validator';

export class AuthExistsPhoneDto {
	@ApiProperty({example: '987654321'})
	@IsNotEmpty()
	@IsString()
	@Length(9, 9)
	@Matches(/^9\d{8}$/)
	phone: string;
}

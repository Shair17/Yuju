import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, Length, IsString} from 'class-validator';

export class AuthConfirmPhoneDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(6, 6)
	code: string;
}

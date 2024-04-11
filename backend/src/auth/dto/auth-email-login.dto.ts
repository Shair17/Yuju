import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty} from 'class-validator';
import {Transform} from 'class-transformer';
import {lowerCaseTransformer} from '../../utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
	@ApiProperty({example: 'admin@example.com'})
	@Transform(lowerCaseTransformer)
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({example: 'secret'})
	@IsNotEmpty()
	password: string;
}

import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsEmail} from 'class-validator';
import {lowerCaseTransformer} from '@yuju/utils/transformers/lower-case.transformer';

export class AuthEmailExistsDto {
	@ApiProperty({example: 'admin@example.com'})
	@Transform(lowerCaseTransformer)
	@IsEmail()
	email: string;
}

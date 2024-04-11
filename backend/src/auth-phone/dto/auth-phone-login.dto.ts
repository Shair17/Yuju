import {ApiProperty} from '@nestjs/swagger';
import {
	IsNotEmpty,
	Length,
	IsString,
	Matches,
	IsOptional,
} from 'class-validator';

export class AuthPhoneLoginDto {
	@ApiProperty({example: '987654321'})
	@IsNotEmpty()
	@IsString()
	@Length(9, 9)
	@Matches(/^9\d{8}$/)
	phone: string;

	@ApiProperty({example: 'John'})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	firstName?: string;

	@ApiProperty({example: 'Doe'})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	lastName?: string;
}

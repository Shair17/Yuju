import {Transform, Type} from 'class-transformer';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
	MinLength,
	Validate,
} from 'class-validator';
import {FileDto} from '../../files/dto/file.dto';
import {RoleDto} from '../../roles/dto/role.dto';
import {StatusDto} from '../../statuses/dto/status.dto';
import {lowerCaseTransformer} from '../../utils/transformers/lower-case.transformer';
import {IsNotExist} from '@yuju/utils/validators/is-not-exists.validator';
import {trimTransformer} from '@yuju/utils/transformers/trim.transformer';

export class CreateUserDto {
	@ApiProperty({example: 'test1@example.com'})
	@Transform(lowerCaseTransformer)
	@IsNotEmpty()
	@IsEmail()
	email: string | null;

	@ApiProperty({example: '987654321'})
	@Transform(trimTransformer)
	@IsNotEmpty()
	@Validate(IsNotExist, ['User'], {
		message: 'phoneAlreadyExists',
	})
	@IsNotEmpty()
	@Length(9, 9)
	@Matches(/^9\d{8}$/)
	phone?: string | null;

	@ApiProperty()
	@IsString()
	@IsOptional()
	@Length(6, 6)
	phoneVerificationCode?: string | null;

	@ApiProperty()
	@MinLength(6)
	password?: string;

	provider?: string;

	socialId?: string | null;

	@ApiProperty({example: 'John'})
	@IsNotEmpty()
	firstName: string | null;

	@ApiProperty({example: 'Doe'})
	@IsNotEmpty()
	lastName: string | null;

	@ApiPropertyOptional({type: () => FileDto})
	@IsOptional()
	photo?: FileDto | null;

	@ApiPropertyOptional({type: RoleDto})
	@IsOptional()
	@Type(() => RoleDto)
	role?: RoleDto | null;

	@ApiPropertyOptional({type: StatusDto})
	@IsOptional()
	@Type(() => StatusDto)
	status?: StatusDto;

	hash?: string | null;
}

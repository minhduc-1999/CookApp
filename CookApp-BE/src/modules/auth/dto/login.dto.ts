import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'email', nullable: false })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', nullable: false })
  readonly password: string;
}

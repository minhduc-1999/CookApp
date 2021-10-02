import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', nullable: false })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', nullable: false })
  readonly password: string;
}

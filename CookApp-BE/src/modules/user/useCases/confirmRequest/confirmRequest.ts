import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { RequestStatus } from "constants/request.constant";

export class ConfirmRequestDTO {

  @ApiProperty({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  note: string;

  requestId: string;
}

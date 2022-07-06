import { ApiPropertyOptional } from "@nestjs/swagger";
import { PageOptionsDto } from "base/pageOptions.base";
import { IsEnum, IsOptional } from "class-validator";
import { RequestStatus } from "constants/request.constant";

export class GetAllRequestsRequestDTO extends PageOptionsDto {
  @ApiPropertyOptional({ enum: RequestStatus })
  @IsEnum(RequestStatus)
  @IsOptional()
  status: RequestStatus;
}

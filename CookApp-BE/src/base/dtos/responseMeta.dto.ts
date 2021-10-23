import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ErrorCode } from "enums/errorCode.enum";
export class MetaDTO {
  constructor(ok: boolean, message?: string, errorCode?: ErrorCode) {
    this.message = message;
    this.ok = ok;
    this.errorCode = errorCode;
  }
  @ApiPropertyOptional({ type: String })
  message?: string;

  @ApiProperty({ type: Boolean })
  ok: boolean;
  
  @ApiPropertyOptional({ enum: ErrorCode, writeOnly: true })
  errorCode?: ErrorCode;
}

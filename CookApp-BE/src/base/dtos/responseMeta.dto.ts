import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ErrorCode } from "enums/errorCode.enum";
export class MetaDTO {
  constructor(ok: boolean, message?: string | [string], errorCode?: ErrorCode) {
    if (typeof message === "string") this.message = [message];
    else this.message = message;
    this.ok = ok;
    this.errorCode = errorCode;
  }
  @ApiPropertyOptional({ type: String })
  message?: string | [string];

  @ApiProperty({ type: Boolean })
  ok: boolean;

  @ApiPropertyOptional({ enum: ErrorCode, writeOnly: true })
  errorCode?: ErrorCode;
}

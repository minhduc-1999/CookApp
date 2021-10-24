import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ErrorCode } from "enums/errorCode.enum";
export class MetaDTO {
  constructor(ok: boolean = true, message?: string | [string], errorCode?: ErrorCode) {
    if (typeof message === "string") this.messages = [message];
    else this.messages = message;
    this.ok = ok;
    this.errorCode = errorCode;
  }
  @ApiPropertyOptional({ type: [String] })
  messages?: [string];

  @ApiProperty({ type: Boolean })
  ok: boolean;

  @ApiPropertyOptional({ enum: ErrorCode, writeOnly: true })
  errorCode?: ErrorCode;
}

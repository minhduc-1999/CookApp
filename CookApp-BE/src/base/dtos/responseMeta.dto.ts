import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserErrorCode } from "enums/errorCode.enum";
export class MetaDTO {
  constructor(ok: boolean = true, message?: string | [string], errorCode?: UserErrorCode) {
    if (typeof message === "string") this.messages = [message];
    else this.messages = message;
    this.ok = ok;
    this.errorCode = errorCode;
  }
  @ApiPropertyOptional({ type: [String] })
  messages?: [string];

  @ApiProperty({ type: Boolean })
  ok: boolean;

  @ApiPropertyOptional({ enum: UserErrorCode, writeOnly: true })
  errorCode?: UserErrorCode;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ErrorCode } from "enums/errorCode.enum";
import { MetaDTO } from "./responseMeta.dto";

export class ResponseDTO<T> {
  constructor(meta: MetaDTO, data?: T) {
    this.data = data;
    this.meta = meta;
  }

  @ApiPropertyOptional()
  data?: T;

  @ApiProperty({ type: MetaDTO })
  meta: MetaDTO;

  public static ok(message: string, data?: any): ResponseDTO<any> {
    return new ResponseDTO(new MetaDTO(true, message), data);
  }

  public static fail(message: string, errorCode: ErrorCode) {
    return new ResponseDTO(new MetaDTO(false, message, errorCode))
  }
}

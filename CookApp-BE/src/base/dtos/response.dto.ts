import { ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseMetaDTO } from './responseMeta.dto';

export class ResponseDTO<T> extends ResponseMetaDTO {
  constructor(status: string, message: string, data: T) {
    super(status, message);
    this.data = data;
  }

  @ApiPropertyOptional()
  data?: T;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { ResponseMetaDTO, Status } from './responseMeta.dto';

export class ResponseDTO<T> extends ResponseMetaDTO {
  constructor(status: Status, message: string, data?: T) {
    super(status, message);
    this.data = data;
  }

  @ApiPropertyOptional()
  data?: T;
}

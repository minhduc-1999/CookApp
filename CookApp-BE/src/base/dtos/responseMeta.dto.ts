import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaDTO {
  constructor(status: string, message: string) {
    this.message = message;
    this.status = status;
  }

  @ApiPropertyOptional()
  message?: string;
  @ApiPropertyOptional()
  status?: string;
}
// tslint:disable-next-line: max-classes-per-file
export class ResponseMetaDTO {
  constructor(message: string, status: string) {
    this.meta = new MetaDTO(message, status);
  }

  @ApiProperty()
  meta: MetaDTO;
}

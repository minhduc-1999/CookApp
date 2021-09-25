import { ApiProperty } from '@nestjs/swagger';

class MetaDTO {
  @ApiProperty()
  ok: boolean;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  total: number;
}

export class ResponsePageMetaDTO {
  @ApiProperty()
  meta: MetaDTO;
}

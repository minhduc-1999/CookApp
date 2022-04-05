import { ApiResponseProperty } from "@nestjs/swagger";

export class PageMetadata {
  @ApiResponseProperty({ type: Number })
  totalPage: number;

  @ApiResponseProperty({ type: Number })
  page: number;

  @ApiResponseProperty({ type: Number })
  pageSize: number;

  @ApiResponseProperty({ type: Number })
  totalCount: number;

  constructor(offset: number, limit: number, total: number) {
    this.page = offset + 1;
    this.pageSize = limit;
    this.totalPage =
      total % limit === 0 ? total / limit : Math.floor(total / limit) + 1;
    this.totalCount = total;
  }
}

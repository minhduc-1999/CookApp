import { ApiResponseProperty } from "@nestjs/swagger";
import { PATH_METADATA } from "@nestjs/common/constants";

export class PageMetadata {
  @ApiResponseProperty({ type: Number })
  totalPage: number;
  @ApiResponseProperty({ type: Number })
  page: number;
  @ApiResponseProperty({ type: Number })
  pageSize: number;
  @ApiResponseProperty({ type: Number })
  totalCount: number;

  constructor(options: Required<PageMetadata>) {
    this.page = options.page;
    this.pageSize = options.pageSize;
    this.totalPage = options.totalPage;
    this.totalCount = options.totalCount;
  }
}

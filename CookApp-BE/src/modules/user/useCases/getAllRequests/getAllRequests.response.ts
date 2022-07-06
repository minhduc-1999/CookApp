import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { RequestResponse } from "base/dtos/response.dto";
import { Request } from "domains/social/request.domain";

export class GetAllRequestsResponseDTO {
  @ApiResponseProperty({ type: [RequestResponse] })
  requests: RequestResponse[];

  @ApiResponseProperty({ type: PageMetadata })
  metadata: PageMetadata;

  constructor(requests: Request[], meta: PageMetadata) {
    this.requests = requests?.map((req) => new RequestResponse(req));
    this.metadata = meta;
  }
}

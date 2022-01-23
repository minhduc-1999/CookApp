import { ApiResponseProperty } from "@nestjs/swagger";
import { MediaType } from "enums/mediaType.enum";

export class MediaDTO {
  @ApiResponseProperty({ type: String })
  key: string

  @ApiResponseProperty({ enum: MediaType })
  type: MediaType

  constructor(media: MediaDTO) {
    this.key = media.key
    this.type = media.type
  }
}

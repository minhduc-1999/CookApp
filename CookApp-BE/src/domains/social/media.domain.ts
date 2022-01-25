import { ApiResponseProperty } from "@nestjs/swagger";
import { MediaType } from "enums/mediaType.enum";

export class Media {
  @ApiResponseProperty({ type: String })
  key: string

  @ApiResponseProperty({ enum: MediaType })
  type: MediaType

  constructor(media: Media) {
    this.key = media.key
    this.type = media.type
  }
}

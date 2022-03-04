import { MediaType } from "enums/mediaType.enum";

export class Media {
  key: string

  type: MediaType

  constructor(media: Media) {
    this.key = media.key
    this.type = media.type
  }
}

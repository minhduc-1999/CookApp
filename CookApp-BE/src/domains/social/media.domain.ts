import { Audit } from "../../domains/audit.domain"
import { IInteractable } from "../../domains/interfaces/IInteractable.interface"
import { MediaType } from "../../enums/social.enum"

export abstract class MediaBase extends Audit implements IInteractable{
  key: string

  url: string

  type: MediaType

  nReactions: number

  nComments: number

  constructor(media: Partial<MediaBase>) {
    super(media)
    this.key = media?.key
    this.url = media?.url
    this.nComments = media?.nComments
    this.nReactions = media?.nReactions
  }

  abstract isValidKey(): boolean 
}

export class Image extends MediaBase {

  constructor(image: Partial<Image>) {
    super(image)
    this.type = MediaType.IMAGE
  }

  isValidKey() : boolean {
    const regex = /^(\w{1,256}\/){0,256}\w{1,256}\.(png|jpg|jpeg|PNG|JPG|JPEG)$/;
    return regex.test(this.key);
  }
}

export class Video extends MediaBase {

  constructor(video: Partial<Video>) {
    super(video)
    this.type = MediaType.VIDEO
  }

  isValidKey(): boolean {
    return true
  }
}

export type Media = Image | Video

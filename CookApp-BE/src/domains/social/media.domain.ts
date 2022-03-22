export abstract class MediaBase {
  key: string

  url: string

  constructor(media: Partial<MediaBase>) {
    this.key = media?.key
    this.url = media?.url
  }

  abstract isValidKey(): boolean 
}

export class Image extends MediaBase {
  type: "IMAGE"

  constructor(image: Partial<Image>) {
    super(image)
    this.type = "IMAGE"
  }

  isValidKey() : boolean {
    const regex = /^(\w{1,256}\/){0,256}\w{1,256}\.(png|jpg|jpeg|PNG|JPG|JPEG)$/;
    return regex.test(this.key);
  }
}

export class Video extends MediaBase {
  type: "VIDEO"

  constructor(video: Partial<Video>) {
    super(video)
    this.type = "VIDEO"
  }

  isValidKey(): boolean {
    return true
  }
}

export type Media = Image | Video

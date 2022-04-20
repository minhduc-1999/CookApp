import { Audit } from "../../domains/audit.domain";
import { Media } from "./media.domain";
import { User } from "./user.domain";

export class Album extends Audit {

  medias: Media[]

  owner: User

  name: string

  description: string

  update(data: Partial<Album>): Partial<Album> {
    return {
      name: data.name ?? this.name,
      medias: data.medias ?? this.medias,
      description: data?.description ?? this.description
    }
  }

  constructor(album: Partial<Album>) {
    super(album)
    this.medias = album?.medias ?? []
    this.name = album?.name
    this.owner = album?.owner
    this.description = album?.description
  }
}

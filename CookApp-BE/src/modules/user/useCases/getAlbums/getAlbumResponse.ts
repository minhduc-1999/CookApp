import { ApiResponseProperty } from "@nestjs/swagger";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { AlbumResponse } from "base/dtos/response.dto";
import { Album } from "domains/social/album.domain";

export class GetAlbumsResponse {
  @ApiResponseProperty({ type: [AlbumResponse] })
  albums: AlbumResponse[];

  metadata: PageMetadata;

  constructor(albums: Album[], meta: PageMetadata) {
    this.albums = albums?.map(album => new AlbumResponse(album));
    this.metadata = meta;
  }
}

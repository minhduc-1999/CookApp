import { ApiResponseProperty } from "@nestjs/swagger";
import { MediaResponse } from "base/dtos/response.dto";
import { Media } from "domains/social/media.domain";
import { Reaction } from "domains/social/reaction.domain";

export class GetPostMediaResponse  extends MediaResponse{
  @ApiResponseProperty({type: Number})
  numberOfComment: number

  constructor(media: Media, reaction: Reaction, nComments: number) {
    super(media, reaction)
    this.numberOfComment = nComments
  }
}

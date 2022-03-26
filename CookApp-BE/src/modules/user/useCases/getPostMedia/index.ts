import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { ICommentRepository } from "modules/user/interfaces/repositories/comment.interface";
import { IPostMediaRepository } from "modules/user/interfaces/repositories/postMedia.interface";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { GetPostMediaRequest } from "./getPostMediaRequest";
import { GetPostMediaResponse } from "./getPostMediaResponse";

export class GetPostMediaQuery extends BaseQuery {
  request: GetPostMediaRequest
  constructor(user: User, req: GetPostMediaRequest) {
    super(user);
    this.request = req
  }
}

@QueryHandler(GetPostMediaQuery)
export class GetPostMediaQueryHandler implements IQueryHandler<GetPostMediaQuery> {
  constructor(
    @Inject("IStorageService")
    private _storageService: IStorageService,
    @Inject("IPostMediaRepository")
    private _postMediaRepo: IPostMediaRepository,
    @Inject("IReactionRepository")
    private _reacRepo: IReactionRepository,
    @Inject("ICommentRepository")
    private _commentRepo: ICommentRepository
  ) { }
  async execute(query: GetPostMediaQuery): Promise<GetPostMediaResponse> {
    const { request, user } = query
    let media = await this._postMediaRepo.getMediaById(request.mid, request.postId);
    if (!media) {
      throw new NotFoundException(ResponseDTO.fail("Post or media not found"))
    }
    [media] = await this._storageService.getDownloadUrls([media])
    const reaction = await this._reacRepo.findById(user.id, media.id)
    const nComments = await this._commentRepo.countComments(media)
    const res = new GetPostMediaResponse(media, reaction, nComments);
    return res
  }
}

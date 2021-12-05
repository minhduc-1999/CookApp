import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { UserDTO } from "dtos/social/user.dto";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IPostService } from "modules/user/services/post.service";
import { GetPostResponse } from "./getPostResponse";

export class GetPostDetailQuery extends BaseQuery {
  postId: string;
  constructor(user: UserDTO, postId: string) {
    super(user);
    this.postId = postId;
  }
}

@QueryHandler(GetPostDetailQuery)
export class GetPostDetailQueryHandler
  implements IQueryHandler<GetPostDetailQuery> {
  constructor(
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}
  async execute(query: GetPostDetailQuery): Promise<GetPostResponse> {
    const post = await this._postService.getPostDetail(query.postId);
    post.images = await this._storageService.getDownloadUrls(post.images);
    if (post.author.avatar?.length > 0) {
      post.author.avatar = (
        await this._storageService.getDownloadUrls([post.author.avatar])
      )[0];
    }
    return post;
  }
}

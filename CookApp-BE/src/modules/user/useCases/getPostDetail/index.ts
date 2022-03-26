import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { User } from "domains/social/user.domain";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IPostService } from "modules/user/services/post.service";
import { GetPostResponse } from "./getPostResponse";

export class GetPostDetailQuery extends BaseQuery {
  postId: string;
  constructor(user: User, postId: string) {
    super(user);
    this.postId = postId;
  }
}

@QueryHandler(GetPostDetailQuery)
export class GetPostDetailQueryHandler
  implements IQueryHandler<GetPostDetailQuery>
{
  constructor(
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IStorageService")
    private _storageService: IStorageService,
  ) {}
  async execute(query: GetPostDetailQuery): Promise<GetPostResponse> {
    const [post, reaction, saved] = await this._postService.getPostDetail(query.postId, query.user.id);
    post.medias = await this._storageService.getDownloadUrls(post.medias);
    if (post.author?.avatar) {
      post.author.avatar = (
        await this._storageService.getDownloadUrls([post.author.avatar])
      )[0];
    }

    const result = new GetPostResponse(post, reaction, saved ? true : false);

    return result;
  }
}

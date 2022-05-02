import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { MediaResponse } from "base/dtos/response.dto";
import { FoodShare } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { PostType } from "enums/social.enum";
import { defaults } from "lodash";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
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
    @Inject("IReactionRepository")
    private _reacRepo: IReactionRepository
  ) {}
  async execute(query: GetPostDetailQuery): Promise<GetPostResponse> {
    const { postId, user } = query;

    let [post, reaction, saved] = await this._postService.getPostDetail(
      postId,
      user.id
    );

    post.medias = await this._storageService.getDownloadUrls(post.medias);
    if (post.author?.avatar) {
      post.author.avatar = (
        await this._storageService.getDownloadUrls([post.author.avatar])
      )[0];
    }

    switch (post.type) {
      case PostType.FOOD_SHARE:
        post = post as FoodShare;
        if (post.ref)
          post.ref.photos = await this._storageService.getDownloadUrls(
            post.ref.photos
          );
        break;
      case PostType.MOMENT:
        break;
      default:
        break;
    }

    const result = new GetPostResponse(post, reaction, saved ? true : false);

    const task = post.medias?.map(async (media) => {
      const mediaReaction = await this._reacRepo.findById(user.id, media.id);
      return new MediaResponse(media, mediaReaction);
    });

    result.medias = await Promise.all(task);

    return result;
  }
}

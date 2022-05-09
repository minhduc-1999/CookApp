import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { MediaResponse } from "base/dtos/response.dto";
import { FoodShare, Moment } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { PostType } from "enums/social.enum";
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
    @Inject("IReactionRepository")
    private _reacRepo: IReactionRepository
  ) {}
  async execute(query: GetPostDetailQuery): Promise<GetPostResponse> {
    const { postId, user } = query;

    let [post, reaction, saved] = await this._postService.getPostDetail(
      postId,
      user.id
    );

    [post] = await this._postService.fulfillData([post]);

    const result = new GetPostResponse(post, reaction, saved ? true : false);

    if (post.type === PostType.MOMENT || post.type === PostType.FOOD_SHARE) {
      const task = (<Moment | FoodShare>post).medias?.map(async (media) => {
        const mediaReaction = await this._reacRepo.findById(user.id, media.id);
        return new MediaResponse(media, mediaReaction);
      });

      result.medias = await Promise.all(task);
    }

    return result;
  }
}

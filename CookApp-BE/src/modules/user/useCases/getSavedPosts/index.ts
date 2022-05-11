import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { User } from "domains/social/user.domain";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { ISavedPostRepository } from "modules/user/interfaces/repositories/savedPost.interface";
import { IPostService } from "modules/user/services/post.service";
import { SavedPostDTO, GetSavedPostsResponse } from "./getSavedPostsResponse";
export class GetSavedPostsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: User, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetSavedPostsQuery)
export class GetSavedPostsQueryHandler
  implements IQueryHandler<GetSavedPostsQuery>
{
  constructor(
    @Inject("IReactionRepository")
    private _reactionRepo: IReactionRepository,
    @Inject("ISavedPostRepository")
    private _savedPostRepo: ISavedPostRepository,
    @Inject("IPostService")
    private _postService: IPostService
  ) {}
  async execute(query: GetSavedPostsQuery): Promise<GetSavedPostsResponse> {
    const { queryOptions, user } = query;
    let [posts, total] = await this._savedPostRepo.getSavedPosts(
      user,
      queryOptions
    );

    for (let savedItem of posts) {
      let { post } = savedItem;
      [post] = await this._postService.fulfillData([post]);
    }

    let meta: PageMetadata;
    if (posts.length > 0) {
      meta = new PageMetadata(queryOptions.offset, queryOptions.limit, total);
    }

    const postsRes = await Promise.all(
      posts.map(async (item) => {
        const temp = new SavedPostDTO(item);
        const reaction = await this._reactionRepo.findById(
          user.id,
          item.post.id
        );
        if (reaction) {
          temp.post.reaction = reaction.type;
        }
        return temp;
      })
    );
    return new GetSavedPostsResponse(postsRes, meta);
  }
}

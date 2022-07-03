import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { ITopicRepository } from "modules/user/adapters/out/repositories/topic.repository";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { IReactionRepository } from "modules/user/interfaces/repositories/reaction.interface";
import { ISavedPostRepository } from "modules/user/interfaces/repositories/savedPost.interface";
import { IPostService } from "modules/user/services/post.service";
import { GetPostResponse } from "../getPostDetail/getPostResponse";
import { GetFeedPostsRequest } from "./getFeedPostsRequest";
import { GetFeedPostsResponse } from "./getFeedPostsResponse";
export class GetFeedPostsQuery extends BaseQuery {
  req: GetFeedPostsRequest;
  constructor(user: User, queryOptions?: GetFeedPostsRequest) {
    super(user);
    this.req = queryOptions;
  }
}

@QueryHandler(GetFeedPostsQuery)
export class GetFeedPostsQueryHandler
  implements IQueryHandler<GetFeedPostsQuery>
{
  constructor(
    @Inject("IFeedRepository")
    private _feedRepo: IFeedRepository,
    @Inject("IReactionRepository")
    private _reactionRepo: IReactionRepository,
    @Inject("ISavedPostRepository")
    private _savedRepo: ISavedPostRepository,
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IPostRepository")
    private _postRepo: IPostRepository,
    @Inject("ITopicRepository")
    private _topicRepository: ITopicRepository
  ) {}
  async execute(query: GetFeedPostsQuery): Promise<GetFeedPostsResponse> {
    const { req, user } = query;
    let posts: Post[] = [];
    let total = 0;
    if (req.tag) {
      [posts, total] = await this._postRepo.getPostsByTag(req.tag, req);
    } else [posts, total] = await this._feedRepo.getPosts(user, req);

    if (posts.length === 0) {
      const topics = await this._topicRepository.getInterestTopics(user);
      const tags = topics.map((topic) => topic.title);
      if (topics.length > 0) {
        [posts, total] = await this._postRepo.getPostsByTags(tags, req);
      }
    }

    posts = await this._postService.fulfillData(posts);

    let meta: PageMetadata;
    if (posts.length > 0) {
      meta = new PageMetadata(req.offset, req.limit, total);
    }

    const postsRes = await Promise.all(
      posts.map(async (post) => {
        const reaction = await this._reactionRepo.findById(user.id, post.id);
        const saved = await this._savedRepo.find(post.id, user.id);
        const temp = new GetPostResponse(post, reaction, saved ? true : false);
        return temp;
      })
    );
    return new GetFeedPostsResponse(postsRes, meta);
  }
}

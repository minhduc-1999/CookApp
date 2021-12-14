import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { UserDTO } from "dtos/social/user.dto";
import { IStorageService } from "modules/share/adapters/out/services/storage.service";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { IPostService } from "modules/user/services/post.service";
import { GetWallPostsResponse } from "./getWallPostsResponse";
export class GetWallPostsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  targetId: string;
  constructor(user: UserDTO, targetId: string, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
    this.targetId = targetId;
  }
}

@QueryHandler(GetWallPostsQuery)
export class GetWallPostsQueryHandler
  implements IQueryHandler<GetWallPostsQuery>
{
  constructor(
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    @Inject("IPostService")
    private _postService: IPostService,
    @Inject("IStorageService") private _storageService: IStorageService
  ) {}
  async execute(query: GetWallPostsQuery): Promise<GetWallPostsResponse> {
    const { queryOptions, user, targetId } = query;
    const tempPosts = await this._wallRepo.getPosts(targetId, queryOptions);
    const posts = await Promise.all(
      tempPosts.map(async (post) => {
        return this._postService.getPostDetail(post.id, {
          attachAuthor: false,
        });
      })
    );
    for (let post of posts) {
      post.images = await this._storageService.getDownloadUrls(post.images);
    }
    const totalCount = await this._wallRepo.getTotalPosts(targetId);
    let meta: PageMetadata;
    if (posts.length > 0) {
      meta = new PageMetadata(
        queryOptions.offset,
        queryOptions.limit,
        totalCount
      );
    }
    return new GetWallPostsResponse(posts, meta);
  }
}

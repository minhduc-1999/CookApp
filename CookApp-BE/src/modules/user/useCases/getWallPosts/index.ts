import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { PageMetadata } from "base/dtos/pageMetadata.dto";
import { PageOptionsDto } from "base/pageOptions.base";
import { UserDTO } from "dtos/user.dto";
import { IWallRepository } from "modules/user/adapters/out/repositories/wall.repository";
import { ConfigService } from "nestjs-config";
import { GetWallPostsResponse } from "./getWallPostsResponse";
export class GetWallPostsQuery extends BaseQuery {
  queryOptions: PageOptionsDto;
  constructor(user: UserDTO, queryOptions?: PageOptionsDto) {
    super(user);
    this.queryOptions = queryOptions;
  }
}

@QueryHandler(GetWallPostsQuery)
export class GetWallPostsQueryHandler
  implements IQueryHandler<GetWallPostsQuery> {
  constructor(
    @Inject("IWallRepository")
    private _wallRepo: IWallRepository,
    private _configService: ConfigService
  ) {}
  async execute(query: GetWallPostsQuery): Promise<GetWallPostsResponse> {
    const { queryOptions, user } = query;
    const posts = await this._wallRepo.getPosts(user, queryOptions);
    posts.forEach((post) => {
      post.images = post.images?.map(
        (image) => this._configService.get("storage.publicUrl") + image
      );
    });
    const totalCount = await this._wallRepo.getTotalPosts(user);
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

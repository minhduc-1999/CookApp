import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BaseQuery } from "base/cqrs/query.base";
import { UserDTO } from "dtos/user.dto";
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
    private _postService: IPostService
  ) {}
  async execute(query: GetPostDetailQuery): Promise<GetPostResponse> {
    return this._postService.getPostDetail(query.postId);
  }
}

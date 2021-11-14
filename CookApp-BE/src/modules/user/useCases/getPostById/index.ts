import { Inject } from "@nestjs/common";
import { ICommandHandler, IQuery, QueryHandler } from "@nestjs/cqrs";
import { UserDTO } from "modules/user/dtos/user.dto";
import { IPostService } from "modules/user/services/post.service";
import { GetPostResponse } from "./getPostResponse";

export class GetPostDetailQuery implements IQuery {
  user: UserDTO;
  postId: string;
  constructor(author: UserDTO, postId: string) {
    this.user = author;
    this.postId = postId;
  }
}

@QueryHandler(GetPostDetailQuery)
export class GetPostDetailQueryHandler implements ICommandHandler<GetPostDetailQuery> {
  constructor(
    @Inject("IPostService")
    private _postService: IPostService
  ) {}
  async execute(query: GetPostDetailQuery): Promise<GetPostResponse> {
    return this._postService.getPostDetail(query.postId);
  }
}

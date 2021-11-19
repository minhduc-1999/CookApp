import { ApiResponseProperty, PickType } from "@nestjs/swagger";
import { PostDTO } from "dtos/post.dto";
import { UserDTO } from "dtos/user.dto";

export class GetPostResponse extends PostDTO {
  constructor(option: Partial<PostDTO>) {
    super(option);
    const { id, avatar, displayName } = option.author;
    this.owner = { id, avatar, displayName };
  }

  @ApiResponseProperty({
    type: PickType(UserDTO, ["id", "avatar", "displayName"]),
  })
  owner: {
    id: string;
    avatar?: string;
    displayName?: string;
  };
}

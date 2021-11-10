import { PartialType, PickType } from "@nestjs/swagger";
import { PostDTO } from "modules/user/dtos/post.dto";

export class EditPostRequest extends PartialType(
  PickType(PostDTO, ["content", "images", "videos", "updatedAt", "id"])
) {}

import { PageOptionsDto } from "base/pageOptions.base";
import { PostDTO } from "dtos/social/post.dto";
import { UserDTO } from "dtos/social/user.dto";
import { Transaction } from "neo4j-driver";

export interface IFeedRepository {
  pushNewPost(post: PostDTO, userId: string[]): Promise<void>;
  getPosts(user: UserDTO, query: PageOptionsDto): Promise<PostDTO[]>;
  getTotalPosts(userId: UserDTO): Promise<number>;
  setTransaction(tx: Transaction): IFeedRepository
}

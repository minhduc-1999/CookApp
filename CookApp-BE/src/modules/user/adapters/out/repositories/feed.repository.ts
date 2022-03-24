import { Inject, Injectable, Logger } from "@nestjs/common";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { PostEntity } from "entities/social/post.entity";
import { Post } from "domains/social/post.domain";
import { User } from "domains/social/user.domain";
import { parseInt } from "lodash";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";

@Injectable()
export class FeedRepository extends BaseRepository implements IFeedRepository {
  private logger: Logger = new Logger(FeedRepository.name);
  constructor() {
    super()
  }
    pushNewPost(post: Post, userId: string[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getPosts(user: User, query: PageOptionsDto): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    getTotalPosts(userId: User): Promise<number> {
        throw new Error("Method not implemented.");
    }
}

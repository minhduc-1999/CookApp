import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { ReactionEntity } from "entities/social/reaction.entity";
import { PostBase, SavedPost, Post} from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";
import { ResponseDTO } from "base/dtos/response.dto";
import { User } from "@sentry/node";
import { PageOptionsDto } from "base/pageOptions.base";

@Injectable()
export class PostRepository extends BaseRepository implements IPostRepository {
  private logger: Logger = new Logger(PostRepository.name);
  constructor() {
    super()
  }
    createPost(post: Post): Promise<Post> {
        throw new Error("Method not implemented.");
    }
    getPostById(postId: string): Promise<Post> {
        throw new Error("Method not implemented.");
    }
    getPostByIds(postId: string[]): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    updatePost(post: Post, editPostDto: EditPostRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }
    reactPost(reaction: Reaction): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    deleteReact(reaction: Reaction): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getReactionByUserId(userId: string, postId: string): Promise<Reaction> {
        throw new Error("Method not implemented.");
    }
    isExisted(postID: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    savePost(savedPost: SavedPost): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteSavedPost(postID: string, user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    isSavedPost(postID: string, user: User): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getSavedPosts(user: User, pageOptionDto: PageOptionsDto): Promise<SavedPost[]> {
        throw new Error("Method not implemented.");
    }
    getTotalSavedPost(user: User): Promise<number> {
        throw new Error("Method not implemented.");
    }

}

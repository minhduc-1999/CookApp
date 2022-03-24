import { Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { SavedPost, Post } from "domains/social/post.domain";
import { Reaction } from "domains/social/reaction.domain";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";
import { User } from "@sentry/node";
import { PageOptionsDto } from "base/pageOptions.base";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "entities/social/post.entity";
import { QueryRunner, Repository } from "typeorm";
import { InteractionEntity } from "entities/social/interaction.entity";

@Injectable()
export class PostRepository extends BaseRepository implements IPostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private _postRepo: Repository<PostEntity>,
  ) {
    super()
  }
  async createPost(post: Post): Promise<Post> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const interaction = await queryRunner.manager.save<InteractionEntity>(new InteractionEntity(post))
      const postEntity = await queryRunner.manager.save<PostEntity>(new PostEntity(post, interaction))
      return postEntity.toDomain()
    }
    return null
  }
  async getPostById(postId: string): Promise<Post> {
    const postEntity = await this._postRepo
      .createQueryBuilder("post")
      .innerJoinAndSelect("post.interaction", "interaction")
      .innerJoinAndSelect("post.author", "author")
      .where("post.id = :id", { id: postId })
      .select(["post", "interaction", "author"])
      .getOne()
    return postEntity?.toDomain()
  }
  async getPostByIds(postIds: string[]): Promise<Post[]> {
    const postEntities = await this._postRepo.findByIds(postIds, {
      relations: ["interaction", "author"]
    })
    return postEntities?.map(entity => entity.toDomain())
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

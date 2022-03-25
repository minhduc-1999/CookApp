import { Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { EditPostRequest } from "modules/user/useCases/editPost/editPostRequest";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "entities/social/post.entity";
import { QueryRunner, Repository } from "typeorm";
import { InteractionEntity } from "entities/social/interaction.entity";
import { Post } from "domains/social/post.domain";

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
}

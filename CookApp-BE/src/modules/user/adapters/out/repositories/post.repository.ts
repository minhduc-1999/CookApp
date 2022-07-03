import { Injectable } from "@nestjs/common";
import { BaseRepository } from "base/repository.base";
import { IPostRepository } from "modules/user/interfaces/repositories/post.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "entities/social/post.entity";
import { QueryRunner, Repository } from "typeorm";
import { InteractionEntity } from "entities/social/interaction.entity";
import { Post } from "domains/social/post.domain";
import { PageOptionsDto } from "base/pageOptions.base";

@Injectable()
export class PostRepository extends BaseRepository implements IPostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private _postRepo: Repository<PostEntity>
  ) {
    super();
  }

  async getPostsByTags(
    tags: string[],
    queryOpt: PageOptionsDto
  ): Promise<[Post[], number]> {
    const query = this._postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("author.account", "authorAccount")
      .leftJoinAndSelect("authorAccount.role", "authorRole")
      .leftJoinAndSelect("post.interaction", "interaction")
      .leftJoinAndSelect("post.medias", "media")
      .leftJoinAndSelect("media.interaction", "mediaInter")
      .leftJoinAndSelect("post.foodRef", "foodRef")
      .leftJoinAndSelect("foodRef.medias", "foodRefPhoto")
      .leftJoinAndSelect("foodRef.author", "foodAuthor")
      .where(`post.tags::jsonb ?| array${JSON.stringify(tags).replace(/"/g, `'`)}`)
      .orderBy("interaction.updatedAt", "DESC")
      .select([
        "post",
        "interaction",
        "author.id",
        "author.displayName",
        "author.avatar",
        "media",
        "mediaInter",
        "foodRef",
        "foodRefPhoto",
        "foodAuthor",
        "authorAccount",
        "authorRole",
      ])
      .skip(queryOpt.limit * queryOpt.offset)
      .take(queryOpt.limit);
    const [entities, total] = await query.getManyAndCount();
    return [entities?.map((entity) => entity.toDomain()), total];
  }

  async getPostsByTag(
    tag: string,
    queryOpt: PageOptionsDto
  ): Promise<[Post[], number]> {
    const query = this._postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("author.account", "authorAccount")
      .leftJoinAndSelect("authorAccount.role", "authorRole")
      .leftJoinAndSelect("post.interaction", "interaction")
      .leftJoinAndSelect("post.medias", "media")
      .leftJoinAndSelect("media.interaction", "mediaInter")
      .leftJoinAndSelect("post.foodRef", "foodRef")
      .leftJoinAndSelect("foodRef.medias", "foodRefPhoto")
      .leftJoinAndSelect("foodRef.author", "foodAuthor")
      .where(`post.tags::jsonb ?| array['${tag}']`)
      .orderBy("interaction.updatedAt", "DESC")
      .select([
        "post",
        "interaction",
        "author.id",
        "author.displayName",
        "author.avatar",
        "media",
        "mediaInter",
        "foodRef",
        "foodRefPhoto",
        "foodAuthor",
        "authorAccount",
        "authorRole",
      ])
      .skip(queryOpt.limit * queryOpt.offset)
      .take(queryOpt.limit);
    const [entities, total] = await query.getManyAndCount();
    return [entities?.map((entity) => entity.toDomain()), total];
  }

  async createPost(post: Post): Promise<Post> {
    if (!post) return null;
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const postInteraction = await queryRunner.manager.save<InteractionEntity>(
        new InteractionEntity(post)
      );
      const postEntity = await queryRunner.manager.save<PostEntity>(
        new PostEntity(post, postInteraction)
      );
      return postEntity?.toDomain();
    }
    return null;
  }
  async getPostById(postId: string): Promise<Post> {
    const postEntity = await this._postRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.interaction", "interaction")
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect("author.account", "account")
      .leftJoinAndSelect("account.role", "role")
      .leftJoinAndSelect("post.medias", "media")
      .leftJoinAndSelect("media.interaction", "mediaInter")
      .leftJoinAndSelect("post.foodRef", "foodRef")
      .leftJoinAndSelect("foodRef.medias", "foodRefPhoto")
      .where("post.id = :id", { id: postId })
      .select([
        "post",
        "interaction",
        "author",
        "media",
        "mediaInter",
        "foodRef",
        "foodRefPhoto",
        "account",
        "role",
      ])
      .getOne();
    return postEntity?.toDomain();
  }
  async getPostByIds(postIds: string[]): Promise<Post[]> {
    const postEntities = await this._postRepo.findByIds(postIds, {
      relations: ["interaction", "author"],
    });
    return postEntities?.map((entity) => entity.toDomain());
  }
  async updatePost(post: Post, data: Partial<Post>): Promise<void> {
    const queryRunner = this.tx.getRef() as QueryRunner;
    if (queryRunner && !queryRunner.isReleased) {
      const entity = new PostEntity(post);
      const updateData = entity.update(data);
      await queryRunner.manager
        .createQueryBuilder()
        .update(InteractionEntity)
        .set({ updatedAt: new Date() })
        .where("id = :id", { id: post.id })
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .update(PostEntity)
        .set(updateData)
        .where("id = :postId", { postId: post.id })
        .execute();
    }
  }
}

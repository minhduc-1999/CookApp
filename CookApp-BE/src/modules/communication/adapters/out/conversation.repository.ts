import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { Conversation } from "domains/social/conversation.domain";
import { User } from "domains/social/user.domain";
import { ConversationEntity, ConversationMemberEntity } from "entities/social/conversation.entity";
import { Not, QueryRunner, Repository } from "typeorm";

export interface IConversationRepository {
  findById(id: string): Promise<Conversation>
  create(conv: Conversation): Promise<Conversation>
  isMember(convId: string, userId: string): Promise<Boolean>
  getMembers(convId: string): Promise<User[]>
  setTransaction(tx: ITransaction): IConversationRepository
  findDirectConversation(memberId1: string, memberId2: string): Promise<Conversation>
  findConversation(userId: string): Promise<Conversation[]>
  findMany(userId: string, queryOpt: PageOptionsDto): Promise<[Conversation[], number]>
}
@Injectable()
export class ConversationRepository extends BaseRepository implements IConversationRepository {
  constructor(
    @InjectRepository(ConversationEntity)
    private _conversationRepo: Repository<ConversationEntity>,
    @InjectRepository(ConversationMemberEntity)
    private _convMemberRepo: Repository<ConversationMemberEntity>,
  ) {
    super()
  }

  async findMany(userId: string, queryOpt: PageOptionsDto): Promise<[Conversation[], number]> {
    const [entities, total] = await this._conversationRepo.createQueryBuilder("conv")
      .leftJoin("conv.members", "member")
      .leftJoinAndSelect("conv.lastMessage", "message")
      .where("member.user_id = :userId", { userId })
      .orderBy("message.createdAt", "DESC")
      .skip(queryOpt.limit * queryOpt.offset)
      .take(queryOpt.limit)
      .getManyAndCount()

    return [
      entities?.map(entity => entity.toDomain()),
      total
    ]
  }

  async findConversation(userId: string): Promise<Conversation[]> {
    const result = await this._convMemberRepo
      .createQueryBuilder("member")
      .distinctOn(["member.conversation_id"])
      .leftJoinAndSelect("member.conversation", "conversation")
      .where("member.user_id = :userId", { userId })
      .getMany()
    return result.map(entity => entity.toDomain()[0])
  }
  async findDirectConversation(memberId1: string, memberId2: string): Promise<Conversation> {
    const result = await this._conversationRepo.query(`
      SELECT * 
      FROM conversations c2 
      WHERE 
        c2.id IN (
          SELECT cm2.conversation_id 
          FROM conversation_members cm2, conversation_members cm 
          WHERE cm2.user_id = $1
           AND cm2.conversation_id = cm.conversation_id 
           AND cm.user_id = $2 )
        AND c2."type" = 'DIRECT'
   `, [memberId1, memberId2])
    if (result.length === 0)
      return null
    return plainToClass(ConversationEntity, result[0]).toDomain()
  }

  async isMember(convId: string, userId: string): Promise<Boolean> {
    const count = await this._convMemberRepo.count({
      relations: ["user"],
      where: {
        user: {
          id: userId
        },
        conversation: {
          id: convId
        }
      }
    })
    return count === 1
  }

  async getMembers(convId: string): Promise<User[]> {
    const entities = await this._convMemberRepo.find({
      relations: ["user"],
      where: {
        conversation: {
          id: convId
        },
        user: {
          status: Not("")
        }
      }
    })
    return entities?.map(item => item.toDomain()[1])
  }

  async create(conv: Conversation): Promise<Conversation> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const conversation = new ConversationEntity(conv)
      const entity = await queryRunner.manager.save(conversation)
      return entity?.toDomain()
    }
    return null
  }


  async findById(id: string) {
    const entity = await this._conversationRepo.findOne(id, {
      relations: ["lastMessage"]
    })
    return entity?.toDomain()
  }
}

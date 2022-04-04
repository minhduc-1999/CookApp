import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseRepository } from "base/repository.base";
import { Conversation } from "domains/social/conversation.domain";
import { User } from "domains/social/user.domain";
import { ConversationEntity, ConversationMemberEntity } from "entities/social/conversation.entity";
import { IsNull, Not, QueryRunner, Repository } from "typeorm";

export interface IConversationRepository {
  findById(id: string): Promise<Conversation>
  create(conv: Conversation): Promise<Conversation>
  isMember(convId: string, userId: string): Promise<Boolean>
  getMembers(convId: string): Promise<User[]>
  setTransaction(tx: ITransaction): IConversationRepository
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
      where: {
        conversation: {
          id: convId
        },
        user: {
          status: Not(IsNull())
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
    const entity = await this._conversationRepo.findOne(id)
    return entity?.toDomain()
  }
}

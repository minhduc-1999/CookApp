import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { Message } from "domains/social/conversation.domain";
import { ConversationMemberEntity } from "entities/social/conversation.entity";
import { MessageEntity } from "entities/social/message.entity";
import { QueryRunner, Repository } from "typeorm";

export interface IMessageRepository {
  createMessage(message: Message): Promise<Message>
  setTransaction(tx: ITransaction): IMessageRepository
  getMessages(convId: string, queryOpt: PageOptionsDto): Promise<[Message[], number]>
}
@Injectable()
export class MessageRepository extends BaseRepository implements IMessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private _messageRepo: Repository<MessageEntity>,
  ) {
    super()
  }

  async getMessages(convId: string, queryOpt: PageOptionsDto): Promise<[Message[], number]> {
    const [entities, total] = await this._messageRepo.findAndCount({
      relations: ["sender", "sender.user"],
      where: {
        conversation: {
          id: convId
        }
      },
      order: {
        createdAt: "DESC"
      },
      skip: queryOpt.limit * queryOpt.offset,
      take: queryOpt.limit
    })
    return [
      entities?.map(entity => entity.toDomain()),
      total
    ]
  }

  async createMessage(message: Message): Promise<Message> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const memberEntity = await queryRunner.manager.findOne<ConversationMemberEntity>(ConversationMemberEntity, {
        where: {
          user: {
            id: message.sender.id
          },
          conversation: {
            id: message.to.id
          }
        }
      })
      const msg = new MessageEntity(message)
      msg.sender = memberEntity
      const result = await queryRunner.manager.save<MessageEntity>(msg)
      return result?.toDomain()
    }
    return null
  }
}


import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITransaction } from "adapters/typeormTransaction.adapter";
import { BaseRepository } from "base/repository.base";
import { Message } from "domains/social/conversation.domain";
import { MessageEntity } from "entities/social/conversation.entity";
import { QueryRunner, Repository } from "typeorm";

export interface IMessageRepository {
  createMessage(message: Message): Promise<Message>
  setTransaction(tx: ITransaction): IMessageRepository
}
@Injectable()
export class MessageRepository extends BaseRepository implements IMessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private _messageRepo: Repository<MessageEntity>,
  ) {
    super()
  }
  async createMessage(message: Message): Promise<Message> {
    const queryRunner = this.tx.getRef() as QueryRunner
    if (queryRunner && !queryRunner.isReleased) {
      const msg = new MessageEntity(message)
      const entity = await queryRunner.manager.save(msg)
      return entity?.toDomain()
    }
    return null
  }
}


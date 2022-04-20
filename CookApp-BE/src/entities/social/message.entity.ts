import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { MessageContentType } from '../../enums/social.enum';
import { AbstractEntity } from '../../base/entities/base.entity';
import { Message, MessageContent } from '../../domains/social/conversation.domain';
import { Audit } from '../../domains/audit.domain';
import { ConversationEntity, ConversationMemberEntity } from './conversation.entity';

@Entity({ name: 'messages' })
export class MessageEntity extends AbstractEntity {

  @Column({ name: "content", nullable: false })
  content: string

  @Column({ type: "enum", enum: MessageContentType, name: "content_type", nullable: false })
  contentType: MessageContentType

  @ManyToOne(() => ConversationEntity, conversation => conversation.messages, { nullable: false })
  @JoinColumn({ name: "conversation_id" })
  conversation: ConversationEntity

  @ManyToOne(() => ConversationMemberEntity, { nullable: false })
  @JoinColumn({ name: "sender_id" })
  sender: ConversationMemberEntity

  constructor(msg: Message) {
    super(msg)
    this.content = msg?.message?.content
    this.contentType = msg?.message?.type
    this.conversation = msg?.to && new ConversationEntity(msg.to)
  }

  toDomain(): Message {
    const audit = new Audit(this)
    return new Message({
      ...audit,
      to: this.conversation?.toDomain(),
      sender: this.sender?.toDomain().user,
      message: new MessageContent(this.content, this.contentType)
    })
  }
}

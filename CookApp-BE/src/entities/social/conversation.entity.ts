import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../domains/social/user.domain';
import { ConversationType, MessageContentType } from '../../enums/social.enum';
import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { Conversation, Message, MessageContent } from 'domains/social/conversation.domain';
import { Audit } from 'domains/audit.domain';

@Entity({ name: 'conversations' })
export class ConversationEntity extends AbstractEntity {

  @Column({ name: 'type', nullable: false, type: "enum", enum: ConversationType })
  type?: ConversationType

  @OneToMany(() => MessageEntity, message => message.conversation)
  messages: MessageEntity[]

  @OneToMany(() => ConversationMemberEntity, member => member.conversation, { cascade: ["insert"] })
  members: ConversationMemberEntity[]

  constructor(conv: Conversation) {
    super(conv)
    this.type = conv?.type
    this.members = conv?.members?.map(member => new ConversationMemberEntity(member))
  }

  toDomain(): Conversation {
    const audit = new Audit(this)
    return new Conversation({
      ...audit,
      type: this.type,
      members: this.members?.map(member => member.toDomain()[1])
    })
  }

}

@Entity({ name: 'conversation_members' })
export class ConversationMemberEntity extends AbstractEntity {
  @ManyToOne(() => ConversationEntity, conversation => conversation.members)
  @JoinColumn({ name: "conversation_id" })
  conversation: ConversationEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity

  constructor(user: User, conv?: Conversation) {
    super(null)
    this.user = user && new UserEntity(user)
    this.conversation = conv && new ConversationEntity(conv)
  }

  toDomain(): [Conversation, User] {
    return [
      this.conversation?.toDomain(),
      this.user?.toDomain()
    ]
  }
}

@Entity({ name: 'messages' })
export class MessageEntity extends AbstractEntity {

  @Column({ name: "content", nullable: false })
  content: string

  @Column({ type: "enum", enum: MessageContentType, name: "content_type", nullable: false })
  contentType: MessageContentType

  @ManyToOne(() => ConversationEntity, conversation => conversation.messages)
  @JoinColumn({ name: "conversation_id" })
  conversation: ConversationEntity

  @ManyToOne(() => ConversationMemberEntity)
  @JoinColumn({ name: "sender_id" })
  sender: ConversationMemberEntity

  constructor(msg: Message) {
    super(msg)
    this.content = msg?.message?.content
    this.contentType = msg?.message?.type
    this.conversation = msg?.to && new ConversationEntity(msg.to)
    this.sender = msg?.sender && new ConversationMemberEntity(msg.sender)
  }

  toDomain(): Message {
    const audit = new Audit(this)
    return new Message({
      ...audit,
      to: this.conversation?.toDomain(),
      sender: this.sender?.toDomain()[1],
      message: new MessageContent(this.content, this.contentType)
    })
  }
}

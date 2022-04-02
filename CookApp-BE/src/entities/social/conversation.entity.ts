import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../domains/social/user.domain';
import { ConversationType, MessageContentType } from '../../enums/social.enum';
import { AbstractEntity } from '../../base/entities/base.entity';
import { Conversation, Message } from '../../domains/social/chat.domain';
import { UserEntity } from './user.entity';

@Entity({ name: 'conversations' })
export class ConversationEntity extends AbstractEntity {

  @Column({ name: 'type', nullable: false, type: "enum", enum: ConversationType })
  type?: ConversationType

  @OneToMany(() => MessageEntity, message => message.conversation)
  messages: MessageEntity[]

  @OneToMany(() => ConversationMemberEntity, member => member.conversation)
  members: ConversationMemberEntity[]

  constructor(user: User) {
    super(user)
  }

  toDomain(): Conversation {
    if (!this.id) return null
  }

}

@Entity({ name: 'conversation_members' })
export class ConversationMemberEntity extends AbstractEntity {
  @ManyToOne(() => ConversationEntity, conversation => conversation.members)
  @JoinColumn({ name: "conversation_id" })
  conversation: ConversationEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id"})
  user: UserEntity
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
  @JoinColumn({ name: "sender_id"})
  sender: ConversationMemberEntity

  constructor(user: User) {
    super(user)
  }

  toDomain(): Message {
    if (!this.id) return null
  }
}

import { Column, Entity, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../domains/social/user.domain';
import { ConversationType } from '../../enums/social.enum';
import { AbstractEntity } from '../../base/entities/base.entity';
import { UserEntity } from './user.entity';
import { Conversation } from '../../domains/social/conversation.domain';
import { Audit } from '../../domains/audit.domain';
import { MessageEntity } from './message.entity';

@Entity({ name: 'conversations' })
export class ConversationEntity extends AbstractEntity {

  @Column({ name: 'type', nullable: false, type: "enum", enum: ConversationType })
  type?: ConversationType

  @OneToMany(() => MessageEntity, message => message.conversation)
  messages: MessageEntity[]

  @OneToMany(() => ConversationMemberEntity, member => member.conversation, { cascade: ["insert"] })
  members: ConversationMemberEntity[]

  @OneToOne(() => MessageEntity, { nullable: true })
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: MessageEntity

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
      members: this.members?.map(member => member.toDomain()[1]),
      lastMessage: this.lastMessage?.toDomain()
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

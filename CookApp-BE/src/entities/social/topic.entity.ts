import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../base/entities/base.entity";
import { Topic } from "../../domains/social/user.domain";
import { UserEntity } from "./user.entity";

@Entity({ name: "topics" })
export class TopicEntity extends AbstractEntity {
  @Column({ name: "title", nullable: false })
  title: string;

  @OneToMany(() => UserTopicEntity, (userTopic) => userTopic.topic)
  userTopics: UserTopicEntity[];

  constructor(topic: Topic) {
    super(topic);
    this.title = topic?.title;
  }

  toDomain(): Topic {
    if (!this.id) return null;
    const data = this;
    return new Topic({
      ...data,
    });
  }
}

@Entity({ name: "interested_topics" })
export class UserTopicEntity extends AbstractEntity {
  @ManyToOne(() => TopicEntity, (topic) => topic.userTopics, {
    nullable: false,
  })
  @JoinColumn({ name: "topic_id" })
  topic: TopicEntity;

  @ManyToOne(() => UserEntity, (user) => user.userTopics, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}

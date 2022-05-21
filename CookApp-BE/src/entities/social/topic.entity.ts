import { Image } from "../../domains/social/media.domain";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../base/entities/base.entity";
import { Topic, User } from "../../domains/social/user.domain";
import { UserEntity } from "./user.entity";

@Entity({ name: "topics" })
export class TopicEntity extends AbstractEntity {
  @Column({ name: "title", nullable: false, unique: true })
  title: string;

  @Column({ name: "cover", nullable: true })
  cover: string;

  @OneToMany(() => UserTopicEntity, (userTopic) => userTopic.topic)
  userTopics: UserTopicEntity[];

  constructor(topic: Topic) {
    super(topic);
    this.title = topic?.title;
    this.cover = topic?.cover.key;
  }

  toDomain(): Topic {
    if (!this.id) return null;
    const data = this;
    return new Topic({
      ...data,
      cover: new Image({
        key: this.cover,
      }),
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

  toDomain(): Topic {
    return this.topic?.toDomain();
  }

  constructor(user: User, topic: Topic) {
    super(null);
    this.user = new UserEntity(user);
    this.topic = new TopicEntity(topic);
  }
}

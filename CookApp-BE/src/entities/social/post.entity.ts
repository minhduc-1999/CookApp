import { UserEntity } from './user.entity';
import { OneToMany, OneToOne, ManyToOne, Column, Entity, JoinColumn } from 'typeorm';
import { InteractionEntity } from './interaction.entity';
import { MediaType } from '../../enums/social.enum';

@Entity({ name: 'posts' })
export class PostEntity {

  @OneToOne(() => InteractionEntity, { primary: true })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "author_id" })
  author: UserEntity;

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'status' })
  status: string

  @Column({ name: 'content' })
  content: string

  @OneToMany(() => PostMediaEntity, media => media.post)
  medias: PostMediaEntity[]
}

@Entity({ name: 'post_medias' })
export class PostMediaEntity {

  @OneToOne(() => InteractionEntity, { primary: true })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  interaction: InteractionEntity

  @ManyToOne(() => PostEntity)
  @JoinColumn({ name: "post_id" })
  post: PostEntity;

  @Column({
    name: 'type',
    type: "enum",
    enum: MediaType
  })
  type: MediaType;

  @Column({ name: 'key' })
  key: string
}

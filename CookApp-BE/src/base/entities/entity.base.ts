import { Exclude } from 'class-transformer';
import {
  Column,
  Entity, JoinColumn, PrimaryGeneratedColumn, ValueTransformer
} from 'typeorm';

const bigint: ValueTransformer = {
  to: (entityValue: BigInt) => entityValue,
  from: (entityValue: string) => Number(entityValue),
};

@Entity()
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Exclude()
  @Column({
    name: 'created_at',
    type: 'bigint',
    transformer: [bigint],
    default: new Date().getTime(),
  })
  createdAt: number;

  @Exclude()
  @Column({ name: 'created_by' })
  createdBy: number;

  @Exclude()
  @Column({
    name: 'updated_at',
    type: 'bigint',
    transformer: [bigint],
    nullable: true,
  })
  updatedAt: number;

  @JoinColumn({ name: 'created_by' })
  createdByUser: number;

  @Exclude()
  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @JoinColumn({ name: 'updated_by' })
  updatedByUser: number;

  @Exclude()
  @Column({
    name: 'deleted_at',
    type: 'bigint',
    transformer: [bigint],
    nullable: true,
  })
  deletedAt: number;

  @Exclude()
  @Column({ name: 'deleted_by', nullable: true })
  deletedBy: number;
}

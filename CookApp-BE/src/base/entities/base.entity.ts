import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';

export const bigint: ValueTransformer = {
  to: (entityValue: BigInt) => entityValue,
  from: (entityValue: string) => {
    if (!entityValue) return null
    return Number(entityValue)
  },
};

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;

  constructor(audit: Partial<AbstractEntity>)  {
    this.id = audit?.id
  }
}

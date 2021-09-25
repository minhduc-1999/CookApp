import { Column, Entity } from 'typeorm';
import { ModifyDTO } from '../dtos/modify-entity.dto';
import { AbstractEntity } from './entity.base';

@Entity()
export abstract class ModifyEntity extends AbstractEntity {
  @Column({ name: 'is_archived' })
  isArchived: boolean;

  @Column({ name: 'archived_at' })
  archivedAt: number;

  @Column({ name: 'archived_by' })
  archivedBy: number;

  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ name: 'deleted_at' })
  deletedAt: number;

  @Column({ name: 'deleted_by' })
  deletedBy: number;

  dtoClass = ModifyDTO;

}

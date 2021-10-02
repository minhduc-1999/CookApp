import { ModifyDTO } from '../dtos/modify-entity.dto';
import { AbstractEntity } from './entity.base';

export abstract class ModifyEntity extends AbstractEntity {
  isArchived: boolean;

  archivedAt: number;

  archivedBy: number;

  isDeleted: boolean;

  deletedAt: number;

  deletedBy: number;

  dtoClass = ModifyDTO;

}

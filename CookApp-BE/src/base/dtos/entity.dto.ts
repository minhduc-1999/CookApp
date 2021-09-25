import { AbstractEntity } from '../entities/entity.base';

export class AbstractDTO {
  createdAt: number;
  createdBy: number;
  createdByUser: number;
  updatedAt: number;
  updatedBy: number;
  updatedByUser: number;

  constructor(entity: AbstractEntity) {
    this.createdAt = entity.createdAt;
    this.createdBy = entity.createdBy;
    this.createdByUser = entity.createdByUser; 
    this.updatedAt = entity.updatedAt;
    this.updatedBy = entity.updatedBy;
    this.updatedByUser =entity.updatedByUser; 
  }
}

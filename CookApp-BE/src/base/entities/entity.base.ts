import { Exclude } from 'class-transformer';


export abstract class AbstractEntity {
  id: number;

  
  createdAt: number;

  @Exclude()
  createdBy: number;

  @Exclude()

  updatedAt: number;

  createdByUser: number;

  @Exclude()
  updatedBy: number;

  updatedByUser: number;

  @Exclude()

  deletedAt: number;

  @Exclude()
  deletedBy: number;
}

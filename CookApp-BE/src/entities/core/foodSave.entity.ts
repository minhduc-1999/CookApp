import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../base/entities/base.entity";
import { Food } from "../../domains/core/food.domain";
import { UserEntity } from "../../entities/social/user.entity";
import { FoodSaveType } from "../../enums/core.enum";
import { FoodEntity } from "./food.entity";
import { FoodSave } from "../../domains/core/foodSave.domain";

@Entity({ name: "saved_foods" })
export class FoodSaveEntity extends AbstractEntity {
  @Column({ name: "type", type: "enum", enum: FoodSaveType, nullable: false })
  type: FoodSaveType;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => FoodEntity, { nullable: false })
  @JoinColumn({ name: "food_id" })
  food: FoodEntity;

  constructor(save: FoodSave) {
    super(save);
    this.user = save?.user && new UserEntity(save.user);
    this.food = save?.food && new FoodEntity(save.food);
    this.type = save?.type;
  }

  toDomain(): Food {
    return this.food?.toDomain();
  }
}

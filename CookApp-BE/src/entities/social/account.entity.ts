import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { Account, Role, Permission } from "../../domains/social/account.domain";
import { ProviderEntity } from "./provider.entity";
import { AbstractEntity } from "../../base/entities/base.entity";
import { User } from "../../domains/social/user.domain";
import { PermisstionType, RoleType } from "../../enums/system.enum";

@Entity({ name: "permissions" })
export class PermissionEntity extends AbstractEntity {
  @Column({ name: "title", unique: true, nullable: false })
  title: string;

  @Column({ name: "sign", unique: true, nullable: false })
  sign: PermisstionType;

  constructor(pms: Permission) {
    super(pms);
    this.title = pms?.title;
    this.sign = pms?.sign;
  }

  toDomain(): Permission {
    return new Permission(this);
  }
}

@Entity({ name: "roles" })
export class RoleEntity extends AbstractEntity {
  @Column({ name: "title", unique: true, nullable: false })
  title: string;

  @Column({ name: "sign", unique: true, nullable: false })
  sign: RoleType;

  @OneToMany(() => RolePermisstionEntity, (rolePms) => rolePms.role)
  permissions: RolePermisstionEntity[];

  constructor(role: Role) {
    super(role);
    this.title = role?.title;
    this.sign = role?.sign;
    this.permissions = role?.permissions?.map(
      (pms) => new RolePermisstionEntity(role, pms)
    );
  }

  toDomain(): Role {
    const audit = this;
    return new Role({
      ...audit,
      permissions: this.permissions?.map((pms) => pms.toDomain()),
    });
  }
}

@Entity({ name: "accounts" })
export class AccountEntity extends AbstractEntity {
  @Column({ name: "username", unique: true })
  username: string;

  @Column({ name: "email", unique: true })
  email: string;

  @Column({ name: "email_verified", default: false })
  emailVerified: boolean;

  @Column({ name: "phone", nullable: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @OneToOne(() => UserEntity, (user) => user.account, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @OneToOne(() => ProviderEntity, (provider) => provider.account)
  externalProvider: ProviderEntity;

  @ManyToOne(() => RoleEntity, { nullable: false })
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;

  constructor(account: Account, user?: User) {
    super(account);
    this.username = account?.username;
    this.email = account?.email;
    this.emailVerified = account?.emailVerified;
    this.phone = account?.phone;
    this.password = account?.password;
    this.externalProvider =
      account?.externalProvider && new ProviderEntity(account.externalProvider);
    this.user = user && new UserEntity(user);
    this.role = account?.role && new RoleEntity(account.role);
  }

  toDomain(): Account {
    const data = this;
    return new Account({
      ...data,
      externalProvider: this.externalProvider?.toDomain(),
      user: data.user?.toDomain(),
      role: this.role.toDomain(),
    });
  }

  update(data: Partial<Account>): Partial<AccountEntity> {
    return {
      emailVerified: data.emailVerified ?? this.emailVerified,
      password: data.password ?? this.password,
    };
  }
}

@Entity({ name: "role_permissions" })
export class RolePermisstionEntity extends AbstractEntity {
  @ManyToOne(() => RoleEntity, (role) => role.permissions, {
    nullable: false,
  })
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, { nullable: false })
  @JoinColumn({ name: "permission_id" })
  permission: PermissionEntity;

  constructor(role: Role, pms: Permission) {
    super(null);
    this.role = role && new RoleEntity(role);
    this.permission = pms && new PermissionEntity(pms);
  }

  toDomain(): Permission {
    return this.permission?.toDomain();
  }
}

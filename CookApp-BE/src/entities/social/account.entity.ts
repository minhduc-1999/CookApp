import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { Account, AccountRole } from "../../domains/social/account.domain";
import { ProviderEntity } from "./provider.entity";
import { AbstractEntity } from "../../base/entities/base.entity";
import { User } from "../../domains/social/user.domain";
import { RoleType } from "enums/system.enum";

@Entity({ name: "roles" })
export class AccountRoleEntity extends AbstractEntity {
  @Column({ name: "title", unique: true, nullable: false })
  title: string;

  @Column({ name: "slug", unique: true, nullable: false })
  slug: RoleType;

  @OneToMany(() => AccountEntity, (account) => account.role)
  users: AccountEntity[];

  constructor(role: AccountRole) {
    super(role);
    this.title = role?.title;
  }

  toDomain(): AccountRole {
    return new AccountRole(this);
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

  @ManyToOne(() => AccountRoleEntity, (role) => role.users, { nullable: false })
  @JoinColumn({ name: "role_id" })
  role: AccountRoleEntity;

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
    this.role = account?.role && new AccountRoleEntity(account.role);
  }

  toDomain(): Account {
    const data = this;
    return new Account({
      ...data,
      externalProvider: this.externalProvider?.toDomain(),
      user: data.user?.toDomain(),
      role: data.role?.toDomain(),
    });
  }

  update(data: Partial<Account>): Partial<AccountEntity> {
    return {
      emailVerified: data.emailVerified ?? this.emailVerified,
      password: data.password ?? this.password,
    };
  }
}

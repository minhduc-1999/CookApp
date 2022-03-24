import { ITransaction } from "adapters/typeormTransaction.adapter";
import { Account } from "domains/social/account.domain";
import { User } from "domains/social/user.domain";

export interface IAccountRepository {
  createAccount(account: Account, user: User): Promise<Account>;
  setTransaction(tx: ITransaction): IAccountRepository
}

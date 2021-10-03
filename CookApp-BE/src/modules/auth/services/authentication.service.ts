import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { RegisterDTO } from "../dtos/createUser.dto";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../adapters/out/repositories/user.repository";
import { MongoErrorCode } from "enums/mongo_error_code.enum";
import { ErrorCode } from "enums/error_code.enum";
import { ResponseMetaDTO } from "base/dtos/responseMeta.dto";
import { AuditDTO } from "base/dtos/audix.dto";

export interface IAuthentication {
  register(registerDto: RegisterDTO): Promise<any>;
}
@Injectable()
class AuthenticationService implements IAuthentication {
  constructor(@Inject("IUserRepository") private _userRepo: UserRepository) {}
  async register(registerDto: RegisterDTO): Promise<any> {
    const hashedPassword = await bcrypt.hashSync(registerDto.password, 10);
    try {
      const audit = new AuditDTO({
        createdBy: 'system'
      })
      const createdUser = await this._userRepo.createUser({
        ...registerDto,
        ...audit,
        password: hashedPassword,
      });
      return createdUser
    } catch (error) {
      console.error(error)
      if (error.code === MongoErrorCode.DUPLICATE_KEY)
        throw new BadRequestException(new ResponseMetaDTO('failure', "This user is already existed", ErrorCode.ACCOUNT_ALREADY_EXISTED))
      throw new InternalServerErrorException();
    }
    
  }
}

export default AuthenticationService;

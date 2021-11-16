import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import _ = require("lodash");
import { IUserRepository } from "modules/auth/adapters/out/repositories/user.repository";
import { ClientSession } from "mongoose";
import { RegisterRequest } from "./registerRequest";
import { RegisterResponse } from "./registerResponse";
import * as bcrypt from "bcrypt";
import { WallDTO } from "dtos/wall.dto";
import { UserDTO } from "dtos/user.dto";
import { FeedDTO } from "dtos/feed.dto";
import { IWallRepository } from "modules/auth/adapters/out/repositories/wall.repository";
import { IFeedRepository } from "modules/auth/adapters/out/repositories/feed.repository";

export class RegisterCommand extends BaseCommand {
  registerDto: RegisterRequest;
  constructor(registerDto: RegisterRequest, session: ClientSession) {
    super(session);
    this.registerDto = registerDto;
  }
}
@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject("IUserRepository") private _userRepo: IUserRepository,
    @Inject("IWallRepository") private _wallRepo: IWallRepository,
    @Inject("IFeedRepository") private _feedRepo: IFeedRepository
  ) {}
  async execute(command: RegisterCommand): Promise<RegisterResponse> {
    const { registerDto, session } = command;
    const hashedPassword = await bcrypt.hashSync(registerDto.password, 10);
    const newUserDto = new UserDTO({
      ...registerDto,
      updatedBy: "system",
      createdBy: "system",
      password: hashedPassword,
    });
    const createdUser = await this._userRepo.createUser(newUserDto, session);
    const wallDto = new WallDTO({
      createdBy: createdUser.id,
      updatedBy: createdUser.id,
      user: { id: createdUser.id },
    });
    await this._wallRepo.createWall(wallDto, session);
    const feedDto = new FeedDTO({
      createdBy: createdUser.id,
      updatedBy: createdUser.id,
      user: { id: createdUser.id },
    });
    await this._feedRepo.createFeed(feedDto, session);
    return createdUser;
  }
}

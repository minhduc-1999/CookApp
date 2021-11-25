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
    const newUserDto = UserDTO.create({
      ...registerDto,
      password: hashedPassword,
    });
    const createdUser = await this._userRepo
      .setSession(session)
      .createUser(newUserDto);
    const wallDto = WallDTO.create({
      user: createdUser,
    });
    await this._wallRepo.setSession(session).createWall(wallDto);
    const feedDto = FeedDTO.create({
      user: createdUser,
    });
    await this._feedRepo.setSession(session).createFeed(feedDto);
    return createdUser;
  }
}

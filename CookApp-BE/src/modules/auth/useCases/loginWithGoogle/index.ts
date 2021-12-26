import {
  BadRequestException,
  Inject,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { UserDTO } from "dtos/social/user.dto";
import { ErrorCode } from "enums/errorCode.enum";
import { ExternalProvider } from "enums/externalProvider.enum";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { IUserRepository } from "modules/auth/adapters/out/repositories/user.repository";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { ClientSession } from "mongoose";
import { ConfigService } from "nestjs-config";
import { clean, createUpdatingObject, retrieveUsernameFromEmail } from "utils";
import { GoogleSignInRequest } from "./googleSignInRequest";
import { GoogleSignInResponse } from "./googleSignInResponse";

export class GoogleSignInCommand extends BaseCommand {
  request: GoogleSignInRequest;
  constructor(session: ClientSession, req: GoogleSignInRequest) {
    super(session);
    this.request = req;
  }
}

@CommandHandler(GoogleSignInCommand)
export class GoogleSignInCommandHandler
  implements ICommandHandler<GoogleSignInCommand>
{
  _logger: Logger = new Logger(GoogleSignInCommandHandler.name);
  constructor(
    @Inject("IAuthentication")
    private _authService: IAuthentication,
    private _configService: ConfigService,
    @Inject("IUserRepository")
    private _userRepo: IUserRepository
  ) {}
  async execute(command: GoogleSignInCommand): Promise<GoogleSignInResponse> {
    const user = await this.verify(command.request.idToken)
      .then(async (payload) => {
        const userData: UserDTO = UserDTO.create({
          avatar: payload.picture,
          username: retrieveUsernameFromEmail(payload.email),
          profile: {
            firstName: payload.name,
            lastName: payload.family_name,
          },
          email: payload.email,
          externalProvider: {
            id: payload.sub,
            type: ExternalProvider.GOOGLE,
          },
        });
        let res = await this._userRepo.getUserByEmail(userData.email);

        if (!res) {
          const profile = createUpdatingObject(clean(userData), res.id);
          res = await this._userRepo.updateUserProfile(res.id, userData);
        }

        if (!res) {
          // create new user
          res = await this._userRepo.createUser(userData);
        }

        return res;
      })
      .catch((err) => {
        throw new UnauthorizedException({
          errorCode: ErrorCode.INVALID_GOOGLE_ID_TOKEN,
          message: "Google ID Token is not valid",
        });
      });
    return this._authService.login(user);
  }

  async verify(idToken: string): Promise<TokenPayload> {
    const clientId = await this._configService.get("auth.googleClientID");
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    return payload;
  }
}

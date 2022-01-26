import {
  Inject,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BaseCommand } from "base/cqrs/command.base";
import { User } from "domains/social/user.domain";
import { ErrorCode } from "enums/errorCode.enum";
import { ExternalProvider } from "enums/externalProvider.enum";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { IUserRepository } from "modules/auth/interfaces/repositories/user.interface";
import { IAuthentication } from "modules/auth/services/authentication.service";
import { Transaction } from "neo4j-driver";
import { ConfigService } from "nestjs-config";
import {
  generateDisplayName,
  retrieveUsernameFromEmail,
} from "utils";
import { GoogleSignInRequest } from "./googleSignInRequest";
import { GoogleSignInResponse } from "./googleSignInResponse";

export class GoogleSignInCommand extends BaseCommand {
  request: GoogleSignInRequest;
  constructor(tx: Transaction, req: GoogleSignInRequest) {
    super(tx);
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
    private _userRepo: IUserRepository,
  ) {}
  async execute(command: GoogleSignInCommand): Promise<GoogleSignInResponse> {
    const { tx } = command;
    const user = await this.verify(command.request.idToken)
      .then(async (payload) => {
        const userData: User = new User({
          avatar: payload.picture,
          username: retrieveUsernameFromEmail(payload.email),
          profile: {
            firstName: payload.given_name,
            lastName: payload.family_name,
          },
          email: payload.email,
          externalProvider: {
            id: payload.sub,
            type: ExternalProvider.GOOGLE,
          },
          displayName: generateDisplayName(),
          emailVerified: true
        });
        let res = await this._userRepo.getUserByEmail(userData.email);

        if (!res) {
          // create new user
          res = await this._userRepo.setTransaction(tx).createUser(userData);
        }

        return res;
      })
      .catch(() => {
        throw new UnauthorizedException({
          errorCode: ErrorCode.INVALID_TOKEN,
          message: "Google ID Token is not valid",
        });
      });
    return this._authService.login(user);
  }

  async verify(idToken: string): Promise<TokenPayload> {
    const clientId = await this._configService.get("auth.googleClientID");
    const client = new OAuth2Client({ clientId: clientId });
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    return payload;
  }
}

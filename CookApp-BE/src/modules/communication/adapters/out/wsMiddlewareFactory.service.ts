import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ExtendedError } from "@sentry/types";
import { IUserService } from "modules/auth/services/user.service";
import { Socket } from "socket.io";

type WsMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => void

export interface IWsMiddlewareFactory {
  useAuth(): WsMiddleware
}

@Injectable()
export class WsMiddlewareFactory implements IWsMiddlewareFactory {
  constructor(
    @Inject("IUserService")
    private _userService: IUserService,
    private _jwtService: JwtService
  ) { }

  useAuth(): WsMiddleware {
    return (socket: Socket, next: (err?: ExtendedError) => void) => {
      const token = socket.handshake.auth.token;
      if (token) {
        this._jwtService.verifyAsync(token)
          .then(payload => {
            return this._userService
              .getUserById(payload.sub)
          })
          .then((user) => {
            socket.handshake.auth.user = user
            next()
          })
          .catch(err => {
            if (err.message === "jwt malformed") {
              next(new Error("Invalid credential"))
            }
            next(err)
          })
      }
      else {
        next(new Error("Invalid credential"))
      }

    }
  }
}

import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ExtendedError } from "@sentry/types";
import { JwtAuthTokenPayload } from "base/jwtPayload";
import { IUserService } from "modules/auth/services/user.service";
import { Socket } from "socket.io";

type WsMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => void
type ShouldHandleFn = (req: any) => boolean

export interface IWsMiddlewareFactory {
  useAuth(): WsMiddleware
  useShouldHandle(): ShouldHandleFn
}

@Injectable()
export class WsMiddlewareFactory implements IWsMiddlewareFactory {
  constructor(
    @Inject("IUserService")
    private _userService: IUserService,
    private _jwtService: JwtService
  ) { }

  useShouldHandle(): ShouldHandleFn {
    return (req) => {
      console.log("here")
      const url = new URL(`http://seed.com${req.url}`);
      const token = url.searchParams.get('token')
      const uid = url.searchParams.get('uid')
      if (!token || !uid) return false
      const payload = this._jwtService.verify(token) as JwtAuthTokenPayload 
      if (uid !== payload.sub)
        return false
      console.log(uid)
      return true
    }
  }

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

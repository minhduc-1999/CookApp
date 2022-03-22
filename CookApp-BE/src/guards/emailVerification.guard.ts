import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "domains/social/user.domain";

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const notRequireEmailVerification = this.reflector.get<boolean>(
      "notRequireEmailVerification",
      context.getHandler()
    );

    if (notRequireEmailVerification) return true;

    const request = context.switchToHttp().getRequest();

    const user: User = request.user;

    if (!user.emailVerified) {
      throw new UnauthorizedException("Confirm your email first");
    }

    return true;
  }
}

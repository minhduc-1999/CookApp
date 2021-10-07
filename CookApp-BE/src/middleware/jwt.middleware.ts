import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request | any, res: Response, next: Function) {
    let token: string = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
      try {
        const payload: any = verify(
          token.split(' ')[1],
          process.env.JWT_PRIVATE_KEY,
        );
        if (payload) {
          req.user = payload;
          return next();
        }
      } catch (err) {
        console.error(err);
      }
    }
    throw new UnauthorizedException();
  }
}

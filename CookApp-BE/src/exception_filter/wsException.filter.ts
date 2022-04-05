import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { WsRequestValidationError } from "base/errors/wsRequestError";
import { ChatEventType } from "modules/communication/events/eventType";
import { Socket } from "socket.io";

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    console.error(exception)
    const client = host.switchToWs().getClient<Socket>();
    const err = exception.getError()
    if (err instanceof WsRequestValidationError) {
      client.emit(ChatEventType.CHAT_ERROR, err.message)
      return
    }
    client.emit(ChatEventType.CHAT_ERROR, exception.message)
  }
}

import { Request } from "../request.domain";

export class RequestConfirmedEvent {
  request: Request
  constructor(request: Request) {
    this.request = request
  }
}

export class RequestRejectedEvent {
  request: Request
  constructor(request: Request) {
    this.request = request
  }
}

import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { INotiRepository } from "modules/notification/adapters/out/repositories/notification.repository";

export class NewPostEvent {
  body: String;
  constructor() {
    this.body = "test";
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

@EventsHandler(NewPostEvent)
export class NewPostEventHandler implements IEventHandler<NewPostEvent> {
  constructor(
    @Inject("INotiRepository")
    private _notiRepository: INotiRepository
  ) {}

  async handle(event: NewPostEvent) {
    await sleep(2000);
    this._notiRepository.push();
    console.log("[string]", event);
  }
}

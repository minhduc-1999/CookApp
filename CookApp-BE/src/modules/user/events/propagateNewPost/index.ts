import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { NewPostEvent } from "modules/notification/events/NewPostNotification";
import { IFeedRepository } from "modules/user/interfaces/repositories/feed.interface";
import { IWallRepository } from "modules/user/interfaces/repositories/wall.interface";

@EventsHandler(NewPostEvent)
export class NewPostEventHandler implements IEventHandler<NewPostEvent> {
  constructor(
    @Inject("IWallRepository")
    private _wallRepository: IWallRepository,
    @Inject("IFeedRepository")
    private _feedRepository: IFeedRepository,
    @Inject("INeo4jService")
    private _neo4jService: INeo4jService
  ) { }

  async handle(event: NewPostEvent): Promise<void> {
    const followers = await this._wallRepository.getFollowers(event.author.id);
    if (followers.length === 0)
      return
    const tx = this._neo4jService.beginTransaction()
    try {
      await this._feedRepository.setTransaction(tx).pushNewPost(event.post, followers)
      tx.commit()
    } catch (err) {
      tx.rollback()
      throw err
    }
  }
}

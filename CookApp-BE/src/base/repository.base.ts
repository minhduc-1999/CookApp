import { ClientSession } from "mongoose";

export abstract class BaseRepository {
  protected session: ClientSession;

  public setSession(session: ClientSession) {
    this.session = session;
    return this;
  }
}

import { SearchMsgPayload, SearchRoot } from 'SearchMsg';

export class SearchRootImpl implements SearchRoot {
  public payload: SearchMsgPayload;
  public type: string;

  constructor(payload: SearchMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

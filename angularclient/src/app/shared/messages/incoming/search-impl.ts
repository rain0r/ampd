import { ISearchMsgPayload, ISearchRoot } from 'SearchMsg';

export class SearchRootImpl implements ISearchRoot {
  public payload: ISearchMsgPayload;
  public type: string;

  constructor(payload: ISearchMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

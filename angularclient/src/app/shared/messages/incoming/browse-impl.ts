import { BrowseRoot, BrowseMsgPayload } from 'BrowseMsg';

export class BrowseRootImpl implements BrowseRoot {
  payload: BrowseMsgPayload;
  type: string;

  constructor(payload: BrowseMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

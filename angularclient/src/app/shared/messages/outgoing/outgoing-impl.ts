import { IOutgoingRoot, IPayload } from 'OutgoingMsg';

export class OutgoingRootImpl implements IOutgoingRoot {
  public payload: IPayload;
  public type: string;

  constructor(payload: IPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

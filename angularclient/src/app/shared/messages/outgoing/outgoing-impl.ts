import { OutgoingRoot, Payload } from 'OutgoingMsg';

export class OutgoingRootImpl implements OutgoingRoot {
  payload: Payload;
  type: string;

  constructor(payload: Payload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

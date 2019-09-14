import { ControlPanel, Payload, RootObject } from 'StateMessage';

export class ControlPanelImpl implements ControlPanel {
  random: boolean;
  consume: boolean;
  single: boolean;
  crossfade: boolean;
  repeat: boolean;
  xfade: number;

  constructor() {
    this.random = false;
    this.consume = false;
    this.single = false;
    this.crossfade = false;
    this.repeat = false;
    this.xfade = 0;
  }
}

export class RootObjectImpl implements RootObject {
  payload: Payload;
  type: string;

  constructor(payload: Payload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

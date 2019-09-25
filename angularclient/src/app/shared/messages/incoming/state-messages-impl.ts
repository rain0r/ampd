import { ControlPanel, ServerStatusRoot, StateMsgPayload } from 'StateMsg';

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

export class ServerStatusRootImpl implements ServerStatusRoot {
  payload: StateMsgPayload;
  type: string;

  constructor(payload: StateMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

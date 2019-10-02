import { ControlPanel, ServerStatusRoot, StateMsgPayload } from 'StateMsg';

export class ControlPanelImpl implements ControlPanel {
  public random: boolean;
  public consume: boolean;
  public single: boolean;
  public crossfade: boolean;
  public repeat: boolean;
  public xfade: number;

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
  public payload: StateMsgPayload;
  public type: string;

  constructor(payload: StateMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

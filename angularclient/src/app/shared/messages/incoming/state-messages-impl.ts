import { IControlPanel, IServerStatusRoot, IStateMsgPayload } from 'StateMsg';

export class ControlPanelImpl implements IControlPanel {
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

export class ServerStatusRootImpl implements IServerStatusRoot {
  public payload: IStateMsgPayload;
  public type: string;

  constructor(payload: IStateMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

export interface IControlPanel {
  random: boolean;
  consume: boolean;
  single: boolean;
  crossfade: boolean;
  repeat: boolean;
  xfade: number;
}

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
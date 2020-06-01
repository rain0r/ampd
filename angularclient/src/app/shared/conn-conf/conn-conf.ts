export class ConnConf {
  private _backendAddr: string;

  constructor(backendAddr: string) {
    this._backendAddr = backendAddr;
  }

  get backendAddr(): string {
    return this._backendAddr;
  }

  set backendAddr(value: string) {
    this._backendAddr = value;
  }
}

export class AmpdMessage {
  private _type: string;
  private _data: string;

  constructor(type: string, data = "") {
    this._type = type;
    this._data = data;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get data(): string {
    return this._data;
  }

  set data(value: string) {
    this._data = value;
  }
}

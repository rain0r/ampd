import { InternalMessageType } from "./internal-message-type.enum";

export class AmpdMessage {
  private _type: InternalMessageType;
  private _data: string;

  constructor(type: InternalMessageType, data = "") {
    this._type = type;
    this._data = data;
  }

  get type(): InternalMessageType {
    return this._type;
  }

  set type(value: InternalMessageType) {
    this._type = value;
  }

  get data(): string {
    return this._data;
  }

  set data(value: string) {
    this._data = value;
  }
}

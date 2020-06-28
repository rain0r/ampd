import { InternalMessage } from "../internal-message";

export interface StateChangedMessage extends InternalMessage {
  state: string;
}

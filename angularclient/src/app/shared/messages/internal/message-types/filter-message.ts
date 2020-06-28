import { InternalMessage } from "../internal-message";

export interface FilterMessage extends InternalMessage {
  filterValue: string;
}

import {IQueuePayload} from "./queue-payload";

export interface IQueueRoot {
  type: string;
  payload: IQueuePayload;
}

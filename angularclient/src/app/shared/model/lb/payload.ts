import { Listen } from "./listen";

export interface Payload {
  count: number;
  latestListenTs: number;
  listens: Listen[];
  userId: string;
}

import { QueueTrack } from "../../../models/queue-track";
import { InternalMessage } from "../internal-message";

export interface SongChangedMessage extends InternalMessage {
  song: QueueTrack;
}

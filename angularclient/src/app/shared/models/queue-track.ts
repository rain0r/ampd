import { MpdTrack } from "../messages/incoming/mpd-track";

export class QueueTrack {
  mpdTrack: MpdTrack;
  coverUrl = "";
  elapsed = 0; // elapsed time
  playing = false; // if the track is currently played
  progress = 0; // progress in seconds
  pos = 0; // position in queue

  constructor(mpdTrack: MpdTrack) {
    this.mpdTrack = mpdTrack;
  }
}
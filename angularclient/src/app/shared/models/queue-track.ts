import {ConnectionConfigUtil} from "../conn-conf/conn-conf-util";
import {IMpdTrack} from "../messages/incoming/mpd-track";

export class QueueTrack implements IMpdTrack {
  /* Override */
  albumName = "";
  artistName = "";
  comment = "";
  discNumber = "";
  file = "";
  genre = "";
  id = 0;
  length = 0;
  name = "";
  position = 0;
  title = "";
  track = 0;
  year = "";

  /* QueueTrack */
  progress = 0; // progress in seconds
  elapsedFormatted = ""; // elapsed time readable
  playing = false; // if the track is currently played
  pos = 0; // position in queue

  constructor(mpdSong?: IMpdTrack) {
    this.playing = false;

    if (mpdSong) {
      this.albumName = mpdSong.albumName;
      this.artistName = mpdSong.artistName;
      this.comment = mpdSong.comment;
      this.discNumber = mpdSong.discNumber;
      this.file = mpdSong.file;
      this.genre = mpdSong.genre;
      this.id = mpdSong.id;
      this.length = mpdSong.length;
      this.name = mpdSong.name;
      this.position = mpdSong.position;
      this.title = mpdSong.title;
      this.track = mpdSong.track;
      this.year = mpdSong.year;
      this.file = mpdSong.file;
    }
  }

  coverUrl(): string {
    const cc = ConnectionConfigUtil.get();
    const currentCoverUrl = "current-cover";
    // Add a query param to trigger an image change in the browser
    return `${cc.backendAddr}/${currentCoverUrl}?title=${encodeURIComponent(
      this.title
    )}`;
  }

  durationFormatted(): string {
    if (isNaN(this.length)) {
      return "";
    }
    const totalMinutes = Math.floor(this.length / 60);
    const totalSeconds = this.length - totalMinutes * 60;
    return `${totalMinutes}  :  ${
      totalSeconds < 10 ? "0" : ""
    }  ${totalSeconds}`;
  }
}

import { MpdTrack } from "../messages/incoming/mpd-track";

export class QueueTrack implements MpdTrack {
  albumName: string;
  artistName: string;
  comment: string;
  discNumber: string;
  file: string;
  genre: string;
  id: number;
  length: number;
  name: string;
  position: number;
  title: string;
  track: number;
  year: string;

  // QueueTrack properties
  coverUrl = "";
  elapsed = 0; // elapsed time
  playing = false; // if the track is currently played
  progress = 0; // progress in seconds
  pos = 0; // position in queue

  constructor(currentSong?: MpdTrack) {
    if (currentSong) {
      this.albumName = currentSong.albumName;
      this.artistName = currentSong.artistName;
      this.comment = currentSong.comment;
      this.discNumber = currentSong.discNumber;
      this.file = currentSong.file;
      this.genre = currentSong.genre;
      this.id = currentSong.id;
      this.length = currentSong.length;
      this.name = currentSong.name;
      this.position = currentSong.position;
      this.title = currentSong.title;
      this.track = currentSong.track;
      this.year = currentSong.year;
    }
  }
}

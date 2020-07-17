import { MpdTrack } from "../messages/incoming/mpd-track";

/**
 * A queue track represents a track - who knew it? - a track in the track table of the queue.
 * It's based on a MpdTrack as defined in the javampd library but has some attributes added.
 */
export class QueueTrack implements MpdTrack {
  albumName: string;
  artistName: string;
  comment: string;
  discNumber: string;
  file: string;
  genre: string;
  id: number;
  length = 0;
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
  changed = false; // is this a new song
  dir = ""; // the directory of this track

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

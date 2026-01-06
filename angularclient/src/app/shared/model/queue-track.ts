import { TagMap, Track } from "../messages/incoming/track";

/**
 * A queue track represents a track in the track table of the queue.
 * It's based on a MpdTrack as defined in the javampd library but has some attributes added.
 */
export class QueueTrack implements Track {
  albumName = "";

  artistName = "";

  comment = "";

  discNumber = "";

  /**
   * Path of the file relative to MPD music directory.
   */
  file = "";

  genre = "";

  id = 0;

  /**
   * Track length in seconds.
   */
  length = 0;

  /**
   * Same as title.
   */
  name = "";

  /**
   * Position in the queue.
   */
  position = 0;

  /**
   * Title of the track
   */
  title = "";

  track = "";
  year = "";
  albumArtist = "";
  tagMap = {} as TagMap;

  // QueueTrack properties
  coverUrl = "";
  elapsed = 0; // elapsed time
  playing = false; // if the track is currently played
  progress = 0; // progress in seconds

  dir = ""; // the directory of this track

  constructor(currentTrack?: Track, position = 0) {
    if (currentTrack) {
      this.albumName = currentTrack.albumName?.trim(); // Optional because of radio streams
      this.artistName = currentTrack.artistName?.trim(); // Optional because of radio streams
      this.discNumber = currentTrack.discNumber;
      this.file = currentTrack.file;
      this.albumArtist = currentTrack.albumArtist;
      this.id = currentTrack.id;
      this.length = currentTrack.length;
      this.name = currentTrack.name;
      this.position = position;
      this.track = currentTrack.track;
      this.tagMap = currentTrack.tagMap;
      this.title = currentTrack.title || "";
    }
  }
}

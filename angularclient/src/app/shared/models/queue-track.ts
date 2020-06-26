import { MpdTrack } from "../messages/incoming/mpd-track";

export class QueueTrack {
  mpdTrack: MpdTrack;
  coverUrl = "";
  elapsedFormatted = ""; // elapsed time readable
  playing = false; // if the track is currently played
  progress = 0; // progress in seconds
  pos = 0; // position in queue

  constructor(mpdTrack: MpdTrack) {
    this.mpdTrack = mpdTrack;
  }
}

// export class QueueTrack implements IMpdTrack {
//   /* Override */
//   albumName = "";
//   artistName = "";
//   comment = "";
//   discNumber = "";
//   file = "";
//   genre = "";
//   id = 0;
//   length = 0;
//   name = "";
//   position = 0;
//   title = "";
//   track = 0;
//   year = "";
//
//   /* QueueTrack */
//   coverUrl = "";
//   elapsedFormatted = ""; // elapsed time readable
//   playing = false; // if the track is currently played
//   progress = 0; // progress in seconds
//   pos = 0; // position in queue
//
//   constructor(
//     albumName: string,
//     artistName: string,
//     comment: string,
//     discNumber: string,
//     file: string,
//     genre: string,
//     id: number,
//     length: number,
//     name: string,
//     position: number,
//     title: string,
//     track: number,
//     year: string,
//     coverUrl: string,
//     elapsedFormatted: string,
//     playing: boolean,
//     progress: number,
//     pos: number
//   ) {
//     this.albumName = albumName;
//     this.artistName = artistName;
//     this.comment = comment;
//     this.discNumber = discNumber;
//     this.file = file;
//     this.genre = genre;
//     this.id = id;
//     this.length = length;
//     this.name = name;
//     this.position = position;
//     this.title = title;
//     this.track = track;
//     this.year = year;
//     this.coverUrl = coverUrl;
//     this.elapsedFormatted = elapsedFormatted;
//     this.playing = playing;
//     this.progress = progress;
//     this.pos = pos;
//   }
// }

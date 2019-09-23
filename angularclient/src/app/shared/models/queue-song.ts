import { ConnectionConfiguration } from '../../connection-configuration';
import { MpdSong } from 'QueueMsg';

export class QueueSong implements MpdSong {
  /* Override */
  albumName: string = '';
  artistName: string = '';
  comment: string = '';
  discNumber: string = '';
  file: string = '';
  genre: string = '';
  id: number = 0;
  length: number = 0;
  name: string = '';
  position: number = 0;
  title: string = '';
  track: number = 0;
  year: string = '';

  /* QueueSong */
  progress: number = 0; // progress in seconds
  elapsedFormatted: string = ''; // elapsed time readable
  // durationFormatted: string; // readable / formatted duration
  playing: boolean = false; // if the song is currently played
  pos: number = 0; // position in queue

  constructor(mpdSong?: MpdSong) {
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
    const cc = ConnectionConfiguration.get();
    const currentCoverUrl = '/current-cover';
    // Add a query param to trigger an image change in the browser
    return `${cc.coverServer}/${currentCoverUrl}?title=${this.title}`;
  }

  durationFormatted(): string {
    if (isNaN(this.length)) {
      return '';
    }
    const totalMinutes = Math.floor(this.length / 60);
    const totalSeconds = this.length - totalMinutes * 60;
    return totalMinutes + ':' + (totalSeconds < 10 ? '0' : '') + totalSeconds;
  }
}

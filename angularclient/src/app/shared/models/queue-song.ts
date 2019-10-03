import {IMpdSong} from "../messages/incoming/mpd-song";
import {ConnectionConfiguration} from "../../connection-configuration";

export class QueueSong implements IMpdSong {
  /* Override */
  public albumName: string = '';
  public artistName: string = '';
  public comment: string = '';
  public discNumber: string = '';
  public file: string = '';
  public genre: string = '';
  public id: number = 0;
  public length: number = 0;
  public name: string = '';
  public position: number = 0;
  public title: string = '';
  public track: number = 0;
  public year: string = '';

  /* QueueSong */
  public progress: number = 0; // progress in seconds
  public elapsedFormatted: string = ''; // elapsed time readable
  // durationFormatted: string; // readable / formatted duration
  public playing: boolean = false; // if the song is currently played
  public pos: number = 0; // position in queue

  constructor(mpdSong?: IMpdSong) {
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

  public coverUrl(): string {
    const cc = ConnectionConfiguration.get();
    const currentCoverUrl = 'current-cover';
    // Add a query param to trigger an image change in the browser
    return `${cc.coverServer}/${currentCoverUrl}?title=${this.title}`;
  }

  public durationFormatted(): string {
    if (isNaN(this.length)) {
      return '';
    }
    const totalMinutes = Math.floor(this.length / 60);
    const totalSeconds = this.length - totalMinutes * 60;
    return totalMinutes + ':' + (totalSeconds < 10 ? '0' : '') + totalSeconds;
  }
}

import { MpdSong } from '../mpd/mpd-messages';
import { fromByteArray } from 'base64-js/index';

import { TextEncoderLite } from 'text-encoder-lite/text-encoder-lite';
import { ConnectionConfiguration } from '../../connection-configuration';

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
    let ret: string = cc.coverServer;

    if (this.albumName) {
      ret += this.buildAlbumCoverUrl();
    } else {
      ret += this.buildSingletonCoverUrl();
    }

    return ret;
  }

  private buildAlbumCoverUrl(): string {
    let ret = '/album-cover/';
    const bytes = new TextEncoderLite('utf-8').encode(this.file);
    ret += fromByteArray(bytes);
    ret += '?';

    const params: string[] = [];
    if (this.artistName) {
      params.push('artist=' + encodeURIComponent(this.artistName));
    }
    if (this.artistName) {
      params.push('album=' + encodeURIComponent(this.albumName));
    }
    ret += params.join('&');

    return ret;
  }

  private buildSingletonCoverUrl(): string {
    let ret = '/singleton-cover/?';
    const params: string[] = [];
    if (this.artistName) {
      params.push('artist=' + encodeURIComponent(this.artistName));
    }
    if (this.artistName) {
      params.push('title=' + encodeURIComponent(this.title));
    }
    ret += params.join('&');
    return ret;
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

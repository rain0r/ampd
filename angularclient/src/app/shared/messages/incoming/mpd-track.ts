export interface IMpdTrack {
  name: string;
  title: string;
  artistName: string;
  albumName: string;
  file: string;
  genre: string;
  comment: string;
  year: string;
  discNumber: string;
  length: number;
  track: number;
  position: number;
  id: number;
  displayed: boolean;
}

export class MpdTrack implements IMpdTrack {
  public name: string;
  public title: string;
  public artistName: string;
  public albumName: string;
  public file: string;
  public genre: string;
  public comment: string;
  public year: string;
  public discNumber: string;
  public length: number;
  public track: number;
  public position: number;
  public id: number;
  public displayed: boolean;

  constructor(
    name: string,
    title: string,
    artistName: string,
    albumName: string,
    file: string,
    genre: string,
    comment: string,
    year: string,
    discNumber: string,
    length: number,
    track: number,
    position: number,
    id: number,
    displayed: boolean
  ) {
    this.name = name;
    this.title = title;
    this.artistName = artistName;
    this.albumName = albumName;
    this.file = file;
    this.genre = genre;
    this.comment = comment;
    this.year = year;
    this.discNumber = discNumber;
    this.length = length;
    this.track = track;
    this.position = position;
    this.id = id;
    this.displayed = displayed;
  }
}

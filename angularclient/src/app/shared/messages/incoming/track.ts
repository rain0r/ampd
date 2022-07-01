export interface TagMap {
  Artist: string[];
  MUSICBRAINZ_RELEASETRACKID: string[];
  Album: string[];
  AlbumArtistSort: string[];
  Title: string[];
  MUSICBRAINZ_ALBUMARTISTID: string[];
  Time: string[];
  "Last-Modified": string[];
  AlbumArtist: string[];
  duration: string[];
  Format: string[];
  Disc: string[];
  Pos: string[];
  ArtistSort: string[];
  MUSICBRAINZ_ALBUMID: string[];
  Id: string[];
  MUSICBRAINZ_ARTISTID: string[];
  Track: string[];
}

export interface Track {
  name: string;
  title: string;
  albumArtist: string;
  artistName: string;
  albumName: string;
  file: string;
  discNumber: string;
  track: string;
  length: number;
  tagMap: TagMap;
  position: number;
  id: number;
}

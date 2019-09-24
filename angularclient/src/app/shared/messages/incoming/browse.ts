declare module 'BrowseMsg' {
  import { SafeResourceUrl } from '@angular/platform-browser';

  export interface Directory {
    directory: boolean;
    path: string;
    lastModified?: Date;
    albumCover: SafeResourceUrl;
  }

  export interface Playlist {
    name: string;
    count: number;
  }

  export interface BrowseMsgPayload {
    directories: Directory[];
    songs: any[];
    playlists: Playlist[];
  }

  export interface BrowseRoot {
    type: string;
    payload: BrowseMsgPayload;
  }
}

declare module 'BrowseMsg' {
  export interface Directory {
    directory: boolean;
    path: string;
    lastModified?: Date;
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

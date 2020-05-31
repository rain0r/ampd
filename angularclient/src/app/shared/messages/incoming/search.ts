export interface ISearchResult {
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
}

export interface ISearchMsgPayload {
  searchResults: ISearchResult[];
  searchResultCount: number;
  query: string;
}

export interface ISearchRoot {
  payload: ISearchMsgPayload;
  type: string;
}

export class SearchRootImpl implements ISearchRoot {
  payload: ISearchMsgPayload;
  type: string;

  constructor(payload: ISearchMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}

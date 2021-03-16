import {Track} from "./track";

export interface SearchResponse {
  query: string;
  searchResultCount: number;
  searchResults: Track[];
}

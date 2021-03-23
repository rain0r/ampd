export interface Directory {
  // Data from the backend
  directory: boolean;
  path: string;
  lastModified?: Date;
  // Only used in the frontend
  albumCoverUrl?: string;
  displayedPath?: string;
}

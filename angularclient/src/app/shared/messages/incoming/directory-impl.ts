import { ConnConfUtil } from "../../conn-conf/conn-conf-util";

export interface Directory {
  directory: boolean;
  path: string;
  lastModified?: Date;
}

export class DirectoryImpl implements Directory {
  directory: boolean;
  path: string;

  constructor(directory: boolean, path: string) {
    this.directory = directory;
    this.path = path;
  }

  displayedPath(): string {
    return this.path.trim().split("/").pop() || "";
  }

  coverUrl(): string {
    return `${ConnConfUtil.getFindTrackCoverUrl()}?path=${encodeURIComponent(
      this.path
    )}`;
  }
}
